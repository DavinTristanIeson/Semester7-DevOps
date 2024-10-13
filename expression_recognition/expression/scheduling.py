import itertools
import logging
from typing import Union
import zipfile
import os
import apscheduler
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import apscheduler.triggers
import apscheduler.triggers.interval

from common.asynchronous import TaskTracker
from common.constants import TIMESTAMP_SEPARATOR, FilePaths
import expression

def get_first_file_in_queue()->Union[os.DirEntry[str], None]:
  try:
    return next(itertools.islice(os.scandir(FilePaths.Queue), 1))
  except StopIteration:
    return None

scheduler = AsyncIOScheduler()
logger = logging.getLogger("Expression Recognition")

async def execute_expression_recognition():
  fpath = get_first_file_in_queue()
  if fpath is None:
    return
  basename, ext = os.path.splitext(os.path.basename(fpath.path))
  timestamp, id = basename.split(TIMESTAMP_SEPARATOR, 2)

  logger.info(f"Starting expression recognition task for file: {fpath.path} with ID {id}")

  # Send report to server
  await expression.server.report_operation_pending(id)

  try:
    logger.info(f"Unzipping files from {fpath.path}...")
    with zipfile.ZipFile(fpath.path) as zipf:
      zipf.extractall(FilePaths.TemporaryWorkingDirectory)
    logger.info(f"Files inside {fpath.path} are successfully unzipped to {FilePaths.TemporaryWorkingDirectory}.")

    # Expression recognition go
  except Exception as e:
    logger.error(f"Expression Recognition failed with the following error: {e}")
    TaskTracker().enqueue(
      expression.server.report_operation_failed(id, str(e))
    )
    return
  
  logger.info(f"Expression Recognition successful")
  # Report success
  TaskTracker().enqueue(
    expression.server.report_operation_successful(id, [])
  )

  logger.info(f"Disposing of {fpath.path}...")
  os.remove(fpath.path)
  logger.info(f"{fpath.path} has been disposed successfully")

scheduler.add_job(execute_expression_recognition, trigger=apscheduler.triggers.interval.IntervalTrigger(seconds=15))
