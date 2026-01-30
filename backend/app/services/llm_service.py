"""
LLM service for AI response generation using GitHub Models (phi-4).
"""

from typing import Optional, List, Dict
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

from app.config import settings


class LLMService:
    def __init__(self):
        print("Initializing LLM service...")
        self.llm = None
        self._initialize_llm()
        print("LLM service initialized successfully")

    def _initialize_llm(self):
        if settings.llm_provider != "github":
            raise ValueError("Only GitHub Models are supported right now")

        if not settings.github_token:
            raise ValueError("GITHUB_TOKEN is required")

        if not settings.llm_model:
            raise ValueError("LLM_MODEL must be set (e.g. phi-4)")

        print(f"LLM Provider: github")
        print(f"LLM Model: {settings.llm_model}")
        print(f"GitHub Token present: {bool(settings.github_token)}")

        
        self.llm = ChatOpenAI(
            model=settings.llm_model,  
            api_key=settings.github_token,
            base_url="https://models.inference.ai.azure.com",
            temperature=0.7,
            max_tokens=settings.max_context_length,
        )

    def generate_response(
        self,
        query: str,
        context: Optional[str] = None,
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        messages = []

        messages.append(
            SystemMessage(
                content="You are PedaGrow AI, an intelligent educational assistant."
            )
        )

        if conversation_history:
            for msg in conversation_history[-5:]:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                else:
                    messages.append(AIMessage(content=msg["content"]))

        if context:
            query = f"""Context:
{context}

Question:
{query}
"""

        messages.append(HumanMessage(content=query))

        try:
            print("Generating LLM response...")
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            print(f"LLM error: {e}")
            return "Sorry, I encountered an error while generating a response."


_llm_service: LLMService | None = None


def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service