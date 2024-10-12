import logging
from typing import Sequence

import jwt
import pydantic
from common.constants import EnvironmentVariables
import httpx

from models.api import ApiResult
from models.expression import ExpressionRecognitionTaskResultResource, ExpressionRecognitionTaskStatus, ExpressionRecognitionTaskUpdateSchema

class ExpressionRecognitionApiTokenData(pydantic.BaseModel):
  issuer: str
  
  @staticmethod
  def token()->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.FaceServiceApiSecret)
    content = jwt.encode(ExpressionRecognitionApiTokenData(issuer="Expression Recognition Service").model_dump(), secret, algorithm="HS256")
    return content

api_communicator = httpx.AsyncClient(
  headers={
    "Authorization": f"Bearer {ExpressionRecognitionApiTokenData.token()}",
    "Content-Type": "application/json"
  }
)

logger = logging.getLogger("API Service Communicator")
URL = EnvironmentVariables.get(EnvironmentVariables.ApiServerUrl)

async def update_task(id: str, payload: ExpressionRecognitionTaskUpdateSchema):
  logger.error(f"Operation [Update Task]: Sending a task update request to API server with payload {payload.model_dump_json()}")
  try:
    res = await api_communicator.patch(
      f"{URL}/tasks/{id}",
      data=payload.model_dump()
    )
  except httpx.HTTPError as e:
    logger.error(f"Operation [Update Task]: Error => {e}")
    return
  
  data = ApiResult.model_validate(res.json())
  if res.status_code == 200:
    logger.info(f"Operation [Update Task]: Successful")
  else:
    logger.error(f"Operation [Update Task]: Failed with message {data.message}")
  return data


async def report_operation_pending(id: str):
  return update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Pending,
    error=None,
    results=None,
  ))

async def report_operation_failed(id: str, error: str):
  return update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Failed,
    error=error,
    results=None,
  ))

async def report_operation_successful(id: str, results: Sequence[ExpressionRecognitionTaskResultResource]):
  return update_task(id, ExpressionRecognitionTaskUpdateSchema(
    status=ExpressionRecognitionTaskStatus.Success,
    error=None,
    results=results,
  ))

__all__ = [
  "report_operation_successful",
  "report_operation_failed",
  "report_operation_pending",
]