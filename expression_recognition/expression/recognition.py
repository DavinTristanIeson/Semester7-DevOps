
import logging
import os
import random
import zipfile

from common.constants import FilePaths
import expression
import shutil

from models.expression import BoundingBox, ExpressionRecognitionTaskResultResource, FacialExpressionProbabilities, Point


logger = logging.getLogger("Expression Recognition")

def expression_recognition(
  id: str,
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

def expression_recognition_flow(id: str, path: str):
  playground_path = os.path.dirname(path)
  try:
    logger.info(f"Unzipping files from {path} to {playground_path}...")
    with zipfile.ZipFile(path) as zipf:
      zipf.extractall(playground_path)
    logger.info(f"Files inside {path} are successfully unzipped to {FilePaths.TemporaryWorkingDirectory}.")

    # Expression recognition go
    results = expression_recognition(id, playground_path)
    # Finished
    logger.info(f"Expression Recognition successful")
    expression.server.report_operation_successful(id, results)
  except Exception as e:
    logger.error(f"Expression Recognition failed with the following error: {e}")
    expression.server.report_operation_failed(id, str(e))
  finally:
    logger.info(f"Disposing of {playground_path}...")
    shutil.rmtree(playground_path)
    logger.info(f"{playground_path} has been disposed successfully")
    return