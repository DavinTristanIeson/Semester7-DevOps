import datetime
import pydantic
from sqlalchemy import DateTime, ForeignKey, Integer, String

from models.face import RecognizedFaceModel
from models.files import FileModel, FileResource
from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import Optional, Sequence

from models.user import UserModel, UserResource

class AlbumModel(SQLBaseModel):
  __tablename__ = "albums"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
  # For access
  business_id: Mapped[str] = UUID_column()
  name: Mapped[str] = mapped_column(String(255), nullable=False)
  created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
  accessed_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
  user_id: Mapped[int] = mapped_column(Integer, ForeignKey(UserModel.id, ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

  user: Mapped[UserModel] = relationship('UserModel', back_populates="albums")
  files: Mapped[list["AlbumFileModel"]] = relationship('AlbumFileModel', back_populates="album")

class AlbumFileModel(SQLBaseModel):
  __tablename__ = "album_files"
  id: Mapped[int] = mapped_column(Integer, primary_key=True)
  business_id: Mapped[str] = UUID_column()
  face_id: Mapped[int] = mapped_column(ForeignKey(RecognizedFaceModel.id, onupdate="CASCADE", ondelete="SET NULL"), nullable=False)
  file_id: Mapped[int] = mapped_column(ForeignKey(FileModel.id, onupdate="CASCADE", ondelete="SET NULL"), nullable=False)
  album_id: Mapped[int] = mapped_column(ForeignKey(AlbumModel.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)

  album: Mapped[AlbumModel] = relationship('AlbumModel')
  faces: Mapped[list[RecognizedFaceModel]] = relationship('RecognizedFaceModel', back_populates="album_file")
  file: Mapped[FileModel] = relationship('FileModel')

# Resource    
class AlbumResource(pydantic.BaseModel):
  id: str
  name: str
  created_at: datetime.datetime
  user: Optional[UserResource]
  files: Optional[Sequence[FileResource]]

  @staticmethod
  def from_model(model: AlbumModel, *, user: bool = False)->"AlbumResource":
    files = tuple(map(lambda x: FileResource.from_model(x.file), model.files))
    return AlbumResource(
      id=model.business_id,
      created_at=model.created_at,
      name=model.name,
      user=UserResource.from_model(model.user) if user else None,
      files=files
    )

# Schema
class AlbumSchema(pydantic.BaseModel):
  name: str

class AlbumDeleteSchema(pydantic.BaseModel):
  ids: list[str]