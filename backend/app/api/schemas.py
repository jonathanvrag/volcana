from pydantic import BaseModel
from typing import Optional


# ---- Playlists ----

class PlaylistBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_active: bool = True


class PlaylistCreate(PlaylistBase):
    pass


class PlaylistUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class PlaylistOut(PlaylistBase):
    id: int

    class Config:
        orm_mode = True


# ---- Media items ----

class MediaBase(BaseModel):
    playlist_id: int
    type: str                # 'image', 'video', 'text', 'clip'
    title: Optional[str] = None
    description: Optional[str] = None
    file_url: str
    duration_seconds: int = 20
    order_index: int = 0
    active: bool = True


class MediaCreate(MediaBase):
    pass


class MediaUpdate(BaseModel):
    playlist_id: Optional[int] = None
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    order_index: Optional[int] = None
    active: Optional[bool] = None


class MediaOut(MediaBase):
    id: int

    class Config:
        orm_mode = True
