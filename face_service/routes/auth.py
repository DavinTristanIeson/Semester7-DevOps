import datetime
from fastapi import APIRouter

from controllers.auth import ApiAuthDependency, FileAccessTokenData


router = APIRouter()

@router.post('/access/[album_id]')
def post__access_token(auth: ApiAuthDependency, album_id: str):
  return FileAccessTokenData(
    album_id=album_id,
    exp=datetime.datetime.now() + datetime.timedelta(days=14),
  ).encode()
