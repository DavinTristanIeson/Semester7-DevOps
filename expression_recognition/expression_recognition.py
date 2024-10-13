import asyncio
import dotenv
dotenv.load_dotenv()

import os
import shutil

from common.constants import FilePaths
from expression.scheduling import scheduler

# Run in a separate process
if __name__ == "__main__":
  # cleanup temp directory
  if os.path.exists(FilePaths.TempData):
    shutil.rmtree(FilePaths.TempData)
  os.mkdir(FilePaths.TempData)
  os.mkdir(FilePaths.Queue)
  os.mkdir(FilePaths.TemporaryWorkingDirectory)
  loop = asyncio.new_event_loop()
  asyncio.set_event_loop(loop)
  scheduler.start()
  try:
    loop.run_forever()
  except (KeyboardInterrupt, SystemExit):
    shutil.rmtree(FilePaths.TempData)
