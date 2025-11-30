from fastapi import FastAPI
from app.api import media

app = FastAPI(title="Volcana Pantalla API")

app.include_router(media.router, prefix="/api")
