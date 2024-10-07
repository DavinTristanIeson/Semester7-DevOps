from typing import Sequence
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

from controllers.auth import JWTAuthDependency
from models.album import AlbumDeleteSchema, AlbumSchema
from models.api import ApiResult

import controllers


router = APIRouter()

@router.get('/[id]')
def get__album(id: str, body: AlbumSchema, auth: JWTAuthDependency):
  album = controllers.album.get_album(id)
  return ApiResult(data=album, message=None)

@router.post('/')
def post__album(body: AlbumSchema, auth: JWTAuthDependency):
  album = controllers.album.create_album(body, auth.user_id)
  return JSONResponse(
    content=ApiResult(message="Created album successfully", data = album).model_dump(),
    status_code=201
  )

@router.post('/[id]')
def put__album(id: str, body: AlbumSchema, auth: JWTAuthDependency):
  album = controllers.album.update_album(id, body)
  return ApiResult(message="Created album successfully", data = album)

@router.post('/[id]')
def delete__album(id: str, body: AlbumSchema, auth: JWTAuthDependency):
  controllers.album.delete_album(id)
  return ApiResult(message="Deleted album successfully", data = None)

@router.post('/[id]/files')
def post__album_files(id: str, files: Sequence[UploadFile] = File()):
  album_files = controllers.album.upload_album_files(id, files)
  return ApiResult(message="Uploaded album files", data=album_files)

@router.delete('/[id]/files')
def delete__album_files(id: str, payload: AlbumDeleteSchema):
  album_files = controllers.album.delete_album_files(id, payload.ids)
  return ApiResult(message="Deleted album files", data=album_files)
