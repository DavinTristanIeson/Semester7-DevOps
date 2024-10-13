
import logging
import os
import zipfile

from common.constants import FilePaths
import expression
import shutil


logger = logging.getLogger("Expression Recognition")

async def expression_recognition_flow(id: str, path: str):
  dirname = os.path.dirname(path)
  playground_path = os.path.join(FilePaths.TemporaryWorkingDirectory, dirname)
  try:
    logger.info(f"Unzipping files from {path}...")
    with zipfile.ZipFile(path) as zipf:
      zipf.extractall(playground_path)
    logger.info(f"Files inside {path} are successfully unzipped to {FilePaths.TemporaryWorkingDirectory}.")

    # Expression recognition go
    # Finished
    logger.info(f"Expression Recognition successful")
    await expression.server.report_operation_successful(id, [])
  except Exception as e:
    logger.error(f"Expression Recognition failed with the following error: {e}")
    await expression.server.report_operation_failed(id, str(e))
  finally:
    logger.info(f"Disposing of {playground_path}...")
    shutil.rmtree(playground_path)
    logger.info(f"{playground_path} has been disposed successfully")
    return