from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.sessions import get_db
from app.db import models
from app.deps.auth import get_current_user, require_role
from app.services.audit import log_action
from . import schemas

router = APIRouter()

# =====================
# Playlists
# =====================


@router.get(
    "/playlists",
    response_model=List[schemas.PlaylistOut],
    tags=["Playlists"],
)
def list_playlists(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return db.query(models.Playlist).all()


@router.post(
    "/playlists",
    response_model=schemas.PlaylistOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Playlists"],
)
def create_playlist(
    payload: schemas.PlaylistCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    playlist = models.Playlist(**payload.dict())
    db.add(playlist)

    log_action(
        db,
        user_id=user.id,
        action="playlist_created",
        entity_type="playlist",
        entity_id=playlist.id,
        description=f"Playlist creada: {playlist.name}",
        details={"description": playlist.description},
    )

    db.commit()
    db.refresh(playlist)
    return playlist


@router.get(
    "/playlists/{playlist_id}",
    response_model=schemas.PlaylistOut,
    tags=["Playlists"],
)
def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    playlist = (
        db.query(models.Playlist)
        .filter(models.Playlist.id == playlist_id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    return playlist


@router.put(
    "/playlists/{playlist_id}",
    response_model=schemas.PlaylistOut,
    tags=["Playlists"],
)
def update_playlist(
    playlist_id: int,
    payload: schemas.PlaylistUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    playlist = (
        db.query(models.Playlist)
        .filter(models.Playlist.id == playlist_id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    before = {
        "name": playlist.name,
        "description": playlist.description,
    }

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(playlist, field, value)

    db.add(playlist)

    after = {
        "name": playlist.name,
        "description": playlist.description,
    }

    log_action(
        db,
        user_id=user.id,
        action="playlist_updated",
        entity_type="playlist",
        entity_id=playlist.id,
        description=f"Playlist actualizada: {playlist.name}",
        details={"before": before, "after": after},
    )

    db.commit()
    db.refresh(playlist)
    return playlist


@router.delete(
    "/playlists/{playlist_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Playlists"],
)
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")),
):
    playlist = (
        db.query(models.Playlist)
        .filter(models.Playlist.id == playlist_id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")

    db.delete(playlist)

    log_action(
        db,
        user_id=user.id,
        action="playlist_deleted",
        entity_type="playlist",
        entity_id=playlist.id,
        description=f"Playlist eliminada: {playlist.name}",
    )

    db.commit()
    return None


# =====================
# Media items
# =====================

@router.get(
    "/media",
    response_model=List[schemas.MediaOut],
    tags=["Media"],
)
def list_media(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return db.query(models.MediaItem).all()


@router.post(
    "/media",
    response_model=schemas.MediaOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Media"],
)
def create_media(
    payload: schemas.MediaCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    playlist = (
        db.query(models.Playlist)
        .filter(models.Playlist.id == payload.playlist_id)
        .first()
    )
    if not playlist:
        raise HTTPException(status_code=400, detail="Playlist does not exist")

    media = models.MediaItem(**payload.dict())
    db.add(media)

    log_action(
        db,
        user_id=user.id,
        action="media_created",
        entity_type="media",
        entity_id=media.id,
        description=f"Media creada en playlist {playlist.name}",
        details={
            "playlist_id": media.playlist_id,
            "type": media.type,
            "title": getattr(media, "title", None),
        },
    )

    db.commit()
    db.refresh(media)
    return media


@router.get(
    "/media/{media_id}",
    response_model=schemas.MediaOut,
    tags=["Media"],
)
def get_media(
    media_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    media = (
        db.query(models.MediaItem)
        .filter(models.MediaItem.id == media_id)
        .first()
    )
    if not media:
        raise HTTPException(status_code=404, detail="Media item not found")
    return media


@router.put(
    "/media/{media_id}",
    response_model=schemas.MediaOut,
    tags=["Media"],
)
def update_media(
    media_id: int,
    payload: schemas.MediaUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    media = (
        db.query(models.MediaItem)
        .filter(models.MediaItem.id == media_id)
        .first()
    )
    if not media:
        raise HTTPException(status_code=404, detail="Media item not found")

    before = {
        "playlist_id": media.playlist_id,
        "type": media.type,
        "title": getattr(media, "title", None),
        "active": getattr(media, "active", None),
        "order_index": getattr(media, "order_index", None),
    }

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(media, field, value)

    db.add(media)

    after = {
        "playlist_id": media.playlist_id,
        "type": media.type,
        "title": getattr(media, "title", None),
        "active": getattr(media, "active", None),
        "order_index": getattr(media, "order_index", None),
    }

    log_action(
        db,
        user_id=user.id,
        action="media_updated",
        entity_type="media",
        entity_id=media.id,
        description=f"Media actualizada (id {media.id})",
        details={"before": before, "after": after},
    )

    db.commit()
    db.refresh(media)
    return media


@router.delete(
    "/media/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Media"],
)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin")),
):
    media = (
        db.query(models.MediaItem)
        .filter(models.MediaItem.id == media_id)
        .first()
    )
    if not media:
        raise HTTPException(status_code=404, detail="Media item not found")

    db.delete(media)

    log_action(
        db,
        user_id=user.id,
        action="media_deleted",
        entity_type="media",
        entity_id=media.id,
        description=f"Media eliminada (id {media.id})",
    )

    db.commit()
    return None


# Loop para la pantalla LED (media de una playlist)

@router.get(
    "/playlists/{playlist_id}/media",
    response_model=List[schemas.MediaOut],
    tags=["Media"],
)
def get_playlist_media(
    playlist_id: int,
    db: Session = Depends(get_db),
):
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
