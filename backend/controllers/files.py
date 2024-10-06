import datetime
from typing import Iterable, cast
from fastapi import UploadFile
from sqlalchemy import DateTime
import os
import math

from common.constants import FilePaths
from models.files import FileModel
from models.sql import SQLSession


class UserFileManager:
  def __init__(self):
    pass

  def cleanup(self):
    pass

  def store(self):
    pass

def access_files(file_ids: Iterable[int]):
  with SQLSession.begin() as db:
    files = db.query(FileModel).where(FileModel.id.in_(file_ids)).all()
    file_names = map(lambda x: x.path, files)
    for file in files:
      file.accessed_at = cast(DateTime, datetime.datetime.now())
  return file_names


def upload_files(files: Iterable[UploadFile], past_files: Iterable[int]):
  # TODO: Store metadata in DB, store files
  past_file_paths = map(
    lambda fpath: os.path.join(FilePaths.UserFiles, fpath),
    access_files(past_files)
  )
  
  current_time_identifier = str(math.ceil(1000 * datetime.datetime.now().timestamp()))

  current_file_names = map(lambda file: os.path.join(FilePaths.UserFiles, file.filename, current_time_identifier))
  