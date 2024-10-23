import atexit
import logging
import os
from queue import Empty, Queue
import random
import shutil
import threading
import zipfile
from common.constants import FilePaths
import controllers
from controllers.tasks import EnqueuedExpressionRecognitionTask
from models.expression import BoundingBox, ExpressionRecognitionTaskResultResource, FacialExpressionProbabilities, Point

logger = logging.getLogger("Expression Recognition")

def expression_recognition(
  path: str,
):
  results: list[ExpressionRecognitionTaskResultResource] = []
  for entry in os.scandir(path):
    results.append(ExpressionRecognitionTaskResultResource(
      bbox=BoundingBox(x0=0, x1=1, y0=0, y1=1),
      filename=entry.name,
      probabilities=FacialExpressionProbabilities(
        angry=random.random(),
        disgusted=random.random(),
        happy=random.random(),
        neutral=random.random(),
        sad=random.random(),
        surprised=random.random(),
      ),
      representative_point=Point(x=0, y=0),
    ))
  return results

def service(queue: Queue[EnqueuedExpressionRecognitionTask], stop_event: threading.Event):
  while not stop_event.is_set():
    print("Hello!")
    try: 
      task = queue.get(timeout=1)
    except Empty:
      continue
    
    workspace_path = os.path.join(FilePaths.TempData, task.id)
    try:
      logger.info(f"Processing task {task.model_dump_json()}")
      if not os.path.exists(task.path):
        raise Exception(f"{task.path} no longer exists.")
      
      controllers.server.report_operation_pending(task.id)

      if stop_event.is_set():
        break

      with zipfile.ZipFile(task.path) as zipf:
        zipf.extractall(workspace_path)
      logger.info(f"Files inside {task.path} are successfully unzipped to {workspace_path}.")

      if stop_event.is_set():
        break

      # Expression recognition go
      results = expression_recognition(workspace_path)

      if stop_event.is_set():
        break

      # Finished
      logger.info(f"Expression Recognition successful")
      controllers.server.report_operation_successful(task.id, results)

    except Exception as e:
      logger.error(f"An error occurred while processing task {task.model_dump_json()}. Error: {e}")
      controllers.server.report_operation_failed(task.id, str(e))

    if os.path.exists(workspace_path):
      shutil.rmtree(workspace_path)
      logger.info(f"{workspace_path} has been disposed successfully")
    if os.path.exists(task.path):
      os.remove(task.path)
      logger.info(f"{task.path} has been disposed successfully")

__all__ = [
  "service"
]