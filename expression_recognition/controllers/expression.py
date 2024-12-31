import logging
import os
from queue import Empty, Queue
import random
import shutil
import threading
import zipfile

import cv2 as cv
import numpy as np

from common.constants import FilePaths
from common.logger import RegisteredLogger
from common.metaclass import Singleton
import controllers
from controllers.tasks import EnqueuedExpressionRecognitionTask
from models.expression import BoundingBox, ExpressionRecognitionTaskResultResource, FacialExpressionProbabilities, Point
from controllers.preprocessing import face2vec, EXPRESSION_RECOGNITION_MODEL_PATH

import keras
import numpy.typing as npt

class ExpressionRecognitionModel(metaclass=Singleton):
  model: keras.Model
  def initialize(self):
    model = keras.models.load_model(EXPRESSION_RECOGNITION_MODEL_PATH)

    self.model = model

logger = RegisteredLogger().provision("Expression Recognition")

def expression_recognition(
  path: str,
):
  results: list[ExpressionRecognitionTaskResultResource] = []
  features_list: list[npt.NDArray] = []
  model = ExpressionRecognitionModel().model

  for entry in os.scandir(path):
    try:
      img = cv.imread(entry.path)
      feature = face2vec(img)
    except Exception as e:
      logger.error(f"Skipping {entry.path} due to an unexpected error. Error: {e}")
      continue

    if feature is None:
      logger.warning(f"Found no faces in {entry.path}.")
      continue

    features_list.extend(feature[0])
    for rect in feature[1]:
      results.append(ExpressionRecognitionTaskResultResource(
        bbox=BoundingBox(x0=rect.x0, x1=rect.x1, y0=rect.y0, y1=rect.y1),
        filename=entry.name,
        probabilities=FacialExpressionProbabilities(
          angry=random.random(),
          disgusted=random.random(),
          happy=random.random(),
          neutral=random.random(),
          sad=random.random(),
          surprised=random.random(),
        ),
        width=img.shape[1],
        height=img.shape[0],
      ))

  features = np.vstack(features_list)
  if len(results) == 0:
    return results
  
  predicted = model.predict(features)
  for idx, pred in enumerate(predicted):

    results[idx].probabilities = FacialExpressionProbabilities(
      angry=float(pred[0]),
      disgusted=float(pred[1]),
      happy=float(pred[2]),
      neutral=float(pred[3]),
      sad=float(pred[4]),
      surprised=float(pred[5]),
    )
  
  return results

def service(queue: Queue[EnqueuedExpressionRecognitionTask], stop_event: threading.Event):
  while not stop_event.is_set():
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