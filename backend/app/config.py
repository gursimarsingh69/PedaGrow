from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import List, Literal


class Settings(BaseSettings):
    github_token: str

    api_host: str = "127.0.0.1"
    api_port: int = 8000

    llm_provider: Literal["github"]
    llm_model: str

    embedding_provider: Literal["local"]
    embedding_model: str

    vector_store_type: str
    vectorstore_path: str

    data_path: str = "./data"
    chunk_size: int
    chunk_overlap: int
    top_k_retrieval: int
    max_context_length: int

    cors_origins: List[str] = ["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    class Config:
        env_file = ".env"
        extra = "forbid"


settings = Settings()