
import os
from typing import List, Optional

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

from app.config import settings


class RAGService:
    """Service for retrieving relevant context from knowledge base."""

    def __init__(self):
        self.embeddings = None
        self.vectorstore = None

        try:
            print("Initializing RAG service...")

            
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=settings.chunk_size,
                chunk_overlap=settings.chunk_overlap,
                length_function=len,
            )

            
            print("Initializing embeddings...")
            self._initialize_embeddings()
            print("Embedding model loaded successfully")

            
            print("Initializing vector store...")
            self._initialize_vectorstore()
            print(f"Vector store initialized: {self.vectorstore is not None}")

            if self.vectorstore is None:
                raise RuntimeError("Vector store failed to initialize")

        except Exception as e:
            import traceback
            print(f"❌ Error initializing RAG service: {e}")
            print(traceback.format_exc())
            raise

    def _initialize_embeddings(self):
        if settings.embedding_provider != "local":
            raise RuntimeError(
                "Only local embeddings are supported with GitHub Models"
            )

        self.embeddings = HuggingFaceEmbeddings(
            model_name=settings.embedding_model
        )

    def _initialize_vectorstore(self):
        if settings.vector_store_type != "chroma":
            raise ValueError(
                f"Unsupported vector store type: {settings.vector_store_type}"
            )

        persist_directory = os.path.abspath(settings.vectorstore_path)
        os.makedirs(persist_directory, exist_ok=True)

        try:
            print("Attempting to load existing vector store...")
            self.vectorstore = Chroma(
                persist_directory=persist_directory,
                embedding_function=self.embeddings,
            )

            if self.vectorstore._collection.count() == 0:
                raise RuntimeError("Vector store exists but is empty")

            print("Existing vector store loaded successfully")

        except Exception as e:
            print(f"Creating new vector store because: {e}")
            self._load_and_index_documents()

        if self.vectorstore is None:
            raise RuntimeError("Vector store failed to initialize")

    def _load_and_index_documents(self):
        data_path = os.path.abspath(settings.data_path)
        vectorstore_path = os.path.abspath(settings.vectorstore_path)

        print(f"Loading documents from: {data_path}")
        print(f"Vector store path: {vectorstore_path}")

        os.makedirs(data_path, exist_ok=True)
        os.makedirs(vectorstore_path, exist_ok=True)

        loader = DirectoryLoader(
            data_path,
            glob="**/*.txt",
            loader_cls=TextLoader,
            show_progress=True,
        )

        documents = loader.load()
        print(f"Loaded {len(documents)} documents")

        if not documents:
            print("No documents found, creating sample document...")
            self._create_sample_document(data_path)
            documents = loader.load()

        texts = self.text_splitter.split_documents(documents)
        print(f"Created {len(texts)} text chunks")

        self.vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=self.embeddings,
            persist_directory=vectorstore_path,
        )

        print("Vector store created successfully")

    def _create_sample_document(self, data_path: str):
        sample_content = """PedaGrow AI - Educational Knowledge Base

Welcome to PedaGrow AI, an intelligent learning assistant designed to help students excel in their studies.
"""
        with open(
            os.path.join(data_path, "sample_knowledge.txt"),
            "w",
            encoding="utf-8",
        ) as f:
            f.write(sample_content)

    def retrieve_context(
        self, query: str, top_k: Optional[int] = None
    ) -> List[Document]:
        if self.vectorstore is None:
            raise RuntimeError("Vector store not initialized")

        k = top_k or settings.top_k_retrieval
        return self.vectorstore.similarity_search(query, k=k)

    def get_context_text(
        self, query: str, top_k: Optional[int] = None
    ) -> str:
        docs = self.retrieve_context(query, top_k)
        return "\n\n".join(
            f"[Context {i + 1}]\n{doc.page_content}"
            for i, doc in enumerate(docs)
        )

    def get_sources(
        self, query: str, top_k: Optional[int] = None
    ) -> List[str]:
        docs = self.retrieve_context(query, top_k)
        return list(
            {
                os.path.basename(doc.metadata.get("source", "Unknown"))
                for doc in docs
            }
        )
    
_rag_service: RAGService | None = None


def get_rag_service() -> RAGService:
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service