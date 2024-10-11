import asyncio
from typing import Sequence
import zipfile
from fastapi import UploadFile
import os

from common.constants import FilePaths

async def upload_files(album_id: str, zipped_file: UploadFile):
  with zipfile.ZipFile(zipped_file.file) as zipf:
    zipf.extractall(os.path.join(FilePaths.UserFiles, album_id))

async def __delete_file_single(file: str):
  os.remove(file)
async def delete_files(album_id: str, files: Sequence[str]):
  coroutines: list[asyncio._CoroutineLike] = []
  for fpath in files:
    coroutines.append(__delete_file_single(os.path.join(album_id, fpath)))
  return asyncio.gather(*coroutines)