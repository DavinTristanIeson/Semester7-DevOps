import asyncio
import logging
import dotenv
dotenv.load_dotenv()

import os
import shutil

from common.constants import FilePaths
from expression.scheduling import scheduler

logger = logging.getLogger("Expression Recognition")
logger.setLevel(logging.INFO)

# Run in a separate process
if __name__ == "__main__":
  # cleanup temp directory
  if os.path.exists(FilePaths.TempData):
    shutil.rmtree(FilePaths.TempData)
  os.mkdir(FilePaths.TempData)
  os.mkdir(FilePaths.Queue)
  os.mkdir(FilePaths.TemporaryWorkingDirectory)
  scheduler.start()
