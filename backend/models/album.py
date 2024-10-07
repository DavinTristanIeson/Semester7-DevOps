import datetime
import uuid

import pydantic
from sqlalchemy import DateTime, ForeignKey, Integer, String

from models.face import RecognizedFaceModel
from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column, relationship, Relationship

from typing import List, Optional

from models.user import UserModel, UserResource

class AlbumModel(SQLBaseModel):
  __tablename__ = "albums"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
  # For access
  business_id: Mapped[str] = UUID_column()
  name: Mapped[str] = mapped_column(String(255), nullable=False)
  created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default_factory=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
  accessed_at: Mapped[datetime.datetime] = mapped_column(DateTime, default_factory=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
  user_id: Mapped[int] = mapped_column(Integer, ForeignKey(UserModel.id, ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

  user: Relationship[UserModel] = relationship('UserModel', backref='albums')

class AlbumFileModel(SQLBaseModel):
  id: Mapped[int] = mapped_column(Integer, primary_key=True)
  business_id: Mapped[str] = UUID_column()
  face_id: Mapped[int] = mapped_column(ForeignKey("RecognizedFaceModel.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=False)
  path: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

  faces: Relationship[RecognizedFaceModel] = relationship('RecognizedFaceModel')

# Resource    
class AlbumResource(pydantic.BaseModel):
  id: str
  name: str
  created_at: datetime.datetime
  user: Optional[UserResource]

  @staticmethod
  def from_model(model: AlbumModel, *, user: bool = False)->"AlbumResource":
    return AlbumResource(
      id=model.business_id,
      created_at=model.created_at,
      name=model.name,
      user=UserResource.from_model(model.user) if user else None,
    )

# Schema
class AlbumSchema(pydantic.BaseModel):
  name: str

class AlbumDeleteSchema(pydantic.BaseModel):
  ids: list[str]