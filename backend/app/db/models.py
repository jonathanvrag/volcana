from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from .sessions import Base

class Playlist(Base):
    __tablename__ = "playlist"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)

    items = relationship("MediaItem", back_populates="playlist")

class MediaItem(Base):
    __tablename__ = "media_item"

    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlist.id"))
    type = Column(Text, nullable=False)
    title = Column(Text)
    description = Column(Text)
    file_url = Column(Text, nullable=False)
    duration_seconds = Column(Integer, default=20)
    order_index = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    playlist = relationship("Playlist", back_populates="items")
