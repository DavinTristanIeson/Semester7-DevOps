import io
import os
import aiofiles
import logging
from queue import Queue

import pydantic

from common.constants import TIMESTAMP_SEPARATOR, FilePaths
from common.logger import RegisteredLogger

class EnqueuedExpressionRecognitionTask(pydantic.BaseModel):
  path: str
  id: str

ExpressionRecognitionTaskQueue: Queue[EnqueuedExpressionRecognitionTask] = Queue()

logger = RegisteredLogger().provision("Expression Recognition")

def initialize_queue():
  # Load queue
  if not os.path.exists(FilePaths.TempData):
    return
  logger.info("Initializing queue from file system...")
  for fnode in os.scandir(FilePaths.TempData):
    if fnode.is_dir():
      continue
    try:
      filename = os.path.basename(fnode.path)
      id, ext = os.path.splitext(filename)

      ExpressionRecognitionTaskQueue.put(EnqueuedExpressionRecognitionTask(
        path=fnode.path,
        id=id,
      ))
      logger.info(f"Added task {id} from {fnode.path} to the task queue.")
    except Exception as e:
      logger.error(f"An unexpected error occurred when adding {fnode.path} to the task queue. Error: {e}")
      continue


async def enqueue_task_file(task_id: str, file: io.BytesIO):
  filename = f"{task_id}.zip"

  fpath = os.path.join(FilePaths.TempData, filename)
  async with aiofiles.open(fpath, 'wb') as out_file:
    while chunk:=file.read(4096):
      await out_file.write(chunk)

  ExpressionRecognitionTaskQueue.put(EnqueuedExpressionRecognitionTask(
    id=task_id,
    path=fpath,
  ))

__all__ = [
  "enqueue_task_file",
  "initialize_queue"
]
