import itertools
import logging
from typing import Union
import os
import apscheduler

import apscheduler.triggers
import apscheduler.triggers.interval

from common.constants import TIMESTAMP_SEPARATOR, FilePaths
import expression
from expression.common import scheduler

def get_first_file_in_queue()->Union[os.DirEntry[str], None]:
  try:
    return next(itertools.islice(os.scandir(FilePaths.Queue), 1))
  except StopIteration:
    return None


logger = logging.getLogger("Expression Recognition")

async def check_file_in_queue():
  fpath = get_first_file_in_queue()
  if fpath is None:
    return
  filename = os.path.basename(fpath.path)
  basename, ext = os.path.splitext(filename)
  timestamp, id = basename.split(TIMESTAMP_SEPARATOR, 2)

  logger.info(f"Starting expression recognition task for file: {fpath.path} with ID {id}")

  # move file to tempwd so that it's no longer in the queue
  os.rename(fpath.path, os.path.join(FilePaths.TemporaryWorkingDirectory, id, filename))

  # Send report to server
  await expression.server.report_operation_pending(id)
  scheduler.add_job(expression.recognition.expression_recognition_flow, args=[id, fpath.path], max_instances=4)

scheduler.add_job(check_file_in_queue, trigger=apscheduler.triggers.interval.IntervalTrigger(seconds=5), max_instances=1)
