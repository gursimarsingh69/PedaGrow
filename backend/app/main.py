from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.config import settings

app = FastAPI(title="PedaGrowAI API")

default_origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
]

cors_origins = settings.cors_origins if (settings.cors_origins and len(settings.cors_origins) > 0) else default_origins

print(f"CORS Origins: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False, 
    allow_methods=["*"], 
    allow_headers=["*"], 
    expose_headers=["*"],
    max_age=3600, 
)

app.include_router(router)