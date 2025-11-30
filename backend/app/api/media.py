from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.sessions import SessionLocal
from app.db import models

router = APIRouter(tags=["media"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/playlists/{playlist_id}/media")
def get_playlist_media(playlist_id: int, db: Session = Depends(get_db)):
    items = (
        db.query(models.MediaItem)
        .filter(
            models.MediaItem.playlist_id == playlist_id,
            models.MediaItem.active == True,
        )
        .order_by(models.MediaItem.order_index)
        .all()
    )
    return items
