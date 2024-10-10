import datetime
from typing import Sequence

from fastapi import UploadFile
import sqlalchemy.orm
from controllers.exceptions import ApiError
from models.album import AlbumFileModel, AlbumModel, AlbumResource, AlbumSchema
from models.sql import SQLSession

def query_album(id: str, db: sqlalchemy.orm.Session)->AlbumModel:
  album = db.query(AlbumModel).where(AlbumModel.business_id == id).first()
  if album is None:
    raise ApiError(f"Album with id {id} doesn't exist", 404)
  return album

def get_album(id: str):
  with SQLSession.begin() as db:
    album = query_album(id, db)
    album.files
    db.expunge_all()
  return AlbumResource.from_model(album)


def create_album(payload: AlbumSchema, user_id: int):
  with SQLSession.begin() as db:
    album = AlbumModel(name=payload.name, user_id=user_id)
    db.add(album)
    db.flush()
    album.files
    
    db.expunge_all()
  return AlbumResource.from_model(album)

def update_album(id: str, payload: AlbumSchema):
  with SQLSession.begin() as db:
    album = query_album(id, db)
    album.accessed_at = datetime.datetime.now(datetime.timezone.utc)
    album.name = payload.name
    album.files
    db.expunge_all()
  return AlbumResource.from_model(album)

def delete_album(id: str):
  with SQLSession.begin() as db:
    album = query_album(id, db)
    db.delete(album)
  
def upload_album_files(id: str, files: Sequence[UploadFile])->Sequence[AlbumFileModel]:
  ...

def delete_album_files(id: str, files: Sequence[str]):
  ...
