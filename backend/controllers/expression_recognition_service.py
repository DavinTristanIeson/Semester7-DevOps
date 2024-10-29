import io
import os
import re
from typing import IO, Annotated, BinaryIO
import zipfile
from fastapi import Depends, Request, UploadFile
import jwt
import pydantic
import httpx

from common.constants import EnvironmentVariables
import controllers
from controllers.exceptions import ApiError
from models.api import ApiErrorResult, ApiResult
import logging

class ExpressionRecognitionApiTokenData(pydantic.BaseModel):
  issuer: str
  
  @staticmethod
  def token()->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.ExpressionRecognitionApiSecret)
    content = jwt.encode(ExpressionRecognitionApiTokenData(issuer="Parallel API Backend").model_dump(), secret, algorithm="HS256")
    return content
  
  @staticmethod
  def verify(token: str)->"ExpressionRecognitionApiTokenData":
    secret = EnvironmentVariables.get(EnvironmentVariables.ExpressionRecognitionApiSecret)
    content = jwt.decode(token, secret, algorithms=["HS256"])
    return ExpressionRecognitionApiTokenData.model_validate(content)
  
def jwt_authorize(request: Request)->ExpressionRecognitionApiTokenData:
  header = request.headers.get('Authorization')
  if not header:
    raise ApiError("Expected Authorization header.", 401)
  
  authmatch: list[str] = re.findall('Bearer (.+)', header)
  if len(authmatch) == 0:
    raise ApiError("Expected JWT token in Authorization header.", 401)

  authorization: str = authmatch[0]
  
  try:
    token = ExpressionRecognitionApiTokenData.verify(authorization)
  except jwt.DecodeError as e:
    raise ApiError("Unauthenticated.", 401)

  return token

URL = EnvironmentVariables.get(EnvironmentVariables.ExpressionRecognitionApiUrl)
service_communicator = httpx.AsyncClient(
  headers={
    "Authorization": f"Bearer {ExpressionRecognitionApiTokenData.token()}",
    "Content-Type": "application/json"
  }
)
ExpressionRecognitionApiAuthDependency = Annotated[ExpressionRecognitionApiTokenData, Depends(jwt_authorize)]



logger = logging.getLogger("Expression Recognition Service Communicator")

async def forward_task(id: str, file: bytes):
  logger.info(f"Operation [Forward Task]: Forwarding task {id} to Expression Recognition API")

  try:
    res = await service_communicator.post(f"{URL}/tasks/{id}", content=file, headers={
      "Content-Type": "application/zip"
    })
  except httpx.HTTPError as e:
    logger.error(f"Operation [Forward Task]: Error => {e}")
    raise ApiError("We are unable to communicate with our Expression Recognition Service at the moment. Please try again later.", 500)
  
  if res.status_code == 201:
    logger.info(f"Operation [Forward Task]: Successful")
  else:
    json = res.json()
    data = ApiErrorResult.model_validate(json)
    logger.error(f"Operation [Forward Task]: Failed with message {data.message}")
    raise ApiError("An unexpected error has occurred while uploading your file to the Expression Recognition Service. Please try again later.", res.status_code)

__all__ = [
  "forward_task",
  "ExpressionRecognitionApiAuthDependency"
]