import datetime
import os
import aiofiles
from fastapi import UploadFile

from common.constants import TIMESTAMP_SEPARATOR, FilePaths

async def enqueue_task_file(task_id: str, zipped_file: UploadFile):
  now = datetime.datetime.now(datetime.timezone.utc)
  filename = f"{now.timestamp()}{TIMESTAMP_SEPARATOR}{task_id}.zip"

  fpath = os.path.join(FilePaths.Queue, filename)
  if not os.path.exists(FilePaths.Queue):
    os.mkdir(FilePaths.Queue)
  async with aiofiles.open(fpath, 'rb') as out_file:
    while chunk:=zipped_file.file.read(4096):
      await out_file.write(chunk)

__all__ = [
  "enqueue_task_file"
]
