from fastapi import APIRouter

from controllers.auth import ApiAuthDependency, FileAuthDependency

router = APIRouter()

@router.patch('/files/[album_id]/[filename]')
def download__file(auth: FileAuthDependency, filename: str):
  pass

@router.post('/files/[album_id]/upload')
def post__files(auth: ApiAuthDependency):
  pass

@router.patch('/files/[album_id]/delete')
def delete__files(auth: ApiAuthDependency):
  pass