import asyncio
import datetime
import string
import os
import math
import random
from typing import Iterable, Sequence

from fastapi import UploadFile
import aiofiles
import rocketry.conds

from common.constants import FilePaths
from common.scheduler import TaskTracker, scheduler
from models.files import FileModel
from models.sql import SQLSession

def get_user_file(path: str):
  return open(os.path.join(FilePaths.UserFiles, path))

def get_file_names_from_ids(file_ids: Iterable[int])->Sequence[str]:
  with SQLSession.begin() as db:
    files = db.query(FileModel).where(FileModel.id.in_(file_ids)).all()
    file_names = tuple(map(lambda x: x.path, files))
  return file_names

def get_upload_file_path(file: UploadFile):
  current_time_identifier = str(math.ceil(1000 * datetime.datetime.now(datetime.timezone.utc).timestamp()))
  default_file_name = ''.join(random.choices(string.ascii_letters, k=10))
  return os.path.join(
    FilePaths.UserFiles,
    default_file_name if file.filename is None else file.filename,
    current_time_identifier
  )

async def save_files_locally(files: Iterable[UploadFile]):
  for in_file in files:
    out_file_path = get_upload_file_path(in_file)
    async with aiofiles.open(out_file_path, 'wb') as out_file:
      content = await in_file.read()
      await out_file.write(content)

async def __delete_file_single(file: str):
  os.remove(file)
async def delete_files_locally(files: Iterable[str]):
  coroutines: list[asyncio._CoroutineLike] = []
  for fpath in files:
    coroutines.append(__delete_file_single(fpath))
  return asyncio.gather(*coroutines)

async def upload_files(files: Iterable[UploadFile]):
  with SQLSession.begin() as db:
    current_files = map(
      lambda file: FileModel(
        path=get_upload_file_path(file),
        created_at=datetime.datetime.now(datetime.timezone.utc),
        accessed_at=datetime.datetime.now(datetime.timezone.utc),
      ),
      files
    )
    db.add_all(current_files)

  TaskTracker().enqueue(
    save_files_locally(files)
  )

async def delete_files(file_ids: Iterable[int]):
  with SQLSession.begin() as db:
    files = db.query(FileModel).where(FileModel.id.in_(file_ids)).all()
    file_paths = tuple(map(lambda x: x.path, files))
    
  TaskTracker().enqueue(
    delete_files_locally(file_paths)
  )