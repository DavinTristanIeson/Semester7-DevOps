import asyncio
import datetime
import string
import os
import math
import random
from typing import Iterable, Sequence, Union
import uuid

from fastapi import UploadFile
import aiofiles
import zipfile

from common.constants import FilePaths
from common.scheduler import TaskTracker, scheduler
import controllers
from models.files import FileModel
from models.sql import SQLSession
from models.user import UserModel

# Utils
def get_upload_file_path(prefix: str, filename: Union[str, None]):
  current_time_identifier = str(math.ceil(1000 * datetime.datetime.now(datetime.timezone.utc).timestamp()))
  file_name = (filename or uuid.uuid4().hex) + '_' + current_time_identifier

  return os.path.join(
    FilePaths.UserFiles,
    prefix,
    file_name
  )

# Get

def get_user_file(path: str):
  return open(os.path.join(FilePaths.UserFiles, path))

def get_file_names_from_ids(file_ids: Iterable[int])->Sequence[str]:
  with SQLSession.begin() as db:
    files = db.query(FileModel).where(FileModel.id.in_(file_ids)).all()
    file_names = tuple(map(lambda x: x.path, files))
  return file_names

# Upload
class UploadQueueManager:
  task: list[tuple[str, ]]

async def save_files_locally(prefix: str, files: Iterable[UploadFile]):
  for in_file in files:
    out_file_path = get_upload_file_path(prefix, in_file)
    async with aiofiles.open(out_file_path, 'wb') as out_file:
      content = await in_file.read()
      await out_file.write(content)

def iterate_files_in_zip(archive: zipfile.ZipFile):
  for entry in archive.filelist:
    if entry.is_dir():
      yield from iterate_files_in_zip(archive)
    yield entry

async def upload_files(user_id: int, zipped_file: UploadFile):
  user = controllers.user.get_user(user_id)
  prefix = user.id
  with zipfile.ZipFile(zipped_file.file) as zipf:
    file_paths = []
    with SQLSession.begin() as db:
      for file in iterate_files_in_zip(zipf):
        fpath = get_upload_file_path(prefix, file.filename)
        file_paths.append(fpath)
        db.add(FileModel(
          path=fpath,
          created_at=datetime.datetime.now(datetime.timezone.utc),
        ))


# Delete
async def delete_files(file_ids: Iterable[int]):
  with SQLSession.begin() as db:
    # deleting the actual files will be delegated to a scheduled task
    files = db.query(FileModel).where(FileModel.id.in_(file_ids)).all()
    for file in files:
      db.delete(file)

async def __delete_file_single(file: str):
  os.remove(file)
async def delete_files_locally(prefix: str, files: Iterable[str]):
  coroutines: list[asyncio._CoroutineLike] = []
  for fpath in files:
    coroutines.append(__delete_file_single(os.path.join(prefix, fpath)))
  return asyncio.gather(*coroutines)
