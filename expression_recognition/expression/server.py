import logging
from typing import Sequence

import jwt
import pydantic
from common.constants import EnvironmentVariables
import httpx

from models.api import ApiErrorResult
from models.expression import ExpressionRecognitionTaskResultResource, ExpressionRecognitionTaskStatus, ExpressionRecognitionTaskUpdateSchema

class ExpressionRecognitionApiTokenData(pydantic.BaseModel):
  issuer: str
  
  @staticmethod
  def token()->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.ExpressionRecognitionApiSecret)
    content = jwt.encode(ExpressionRecognitionApiTokenData(issuer="Expression Recognition Service").model_dump(), secret, algorithm="HS256")
    return content

api_communicator = httpx.Client(
  headers={
    "Authorization": f"Bearer {ExpressionRecognitionApiTokenData.token()}",
    "Content-Type": "application/json"
  }
)

logger = logging.getLogger("API Service Communicator")
URL = EnvironmentVariables.get(EnvironmentVariables.ApiServerUrl)

def update_task(id: str, payload: ExpressionRecognitionTaskUpdateSchema):
  logger.error(f"Operation [Update Task]: Sending a task update request to API server with payload {payload.model_dump_json()}")
  try:
    res = api_communicator.patch(
      f"{URL}/api/tasks/{id}",
      json=payload.model_dump()
    )
  except httpx.HTTPError as e:
    logger.error(f"Operation [Update Task]: Error => {e}")
    return
  
  if res.status_code == 200:
    logger.info(f"Operation [Update Task]: Successful")
  else:
    try:
      json = res.json()
      data = ApiErrorResult.model_validate(json)
      logger.error(f"Operation [Update Task]: Failed with message {data.message}")
    except Exception as e:
      logger.error(f"Operation [Update Task]: An unexpected error has occurred => {e}")


def report_operation_pending(id: str):
  update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Pending,
    error=None,
    results=None,
  ))

def report_operation_failed(id: str, error: str):
  update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Failed,
    error=error,
    results=None,
  ))

def report_operation_successful(id: str, results: Sequence[ExpressionRecognitionTaskResultResource]):
  update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Success,
    error=None,
    results=results,
  ))

__all__ = [
  "report_operation_successful",
  "report_operation_failed",
  "report_operation_pending",
]