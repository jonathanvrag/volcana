from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import media
from app.api import upload

app = FastAPI(title="Volcana Pantalla API")

origins = [
    "http://localhost:5173",  # Vite dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
