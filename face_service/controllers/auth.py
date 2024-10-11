import datetime
from enum import Enum
import os
from typing import Annotated
from fastapi import Depends, Request
import pydantic
import re
import jwt

from common.constants import EnvironmentVariables, FilePaths
from controllers.exceptions import ApiError

class ApiTokenData(pydantic.BaseModel):
  issuer: str
  
  @staticmethod
  def decode(token: str)->"ApiTokenData":
    secret = EnvironmentVariables.get(EnvironmentVariables.ApiKey)
    content = jwt.decode(token, secret, algorithms=["HS256"])
    return ApiTokenData.model_validate(content)

class FileAccessTokenData(pydantic.BaseModel):
  album_id: str
  exp: datetime.datetime

  @staticmethod
  def decode(token: str)->"FileAccessTokenData":
    secret = EnvironmentVariables.get(EnvironmentVariables.FileAccessTokenSecret)
    content = jwt.decode(token, secret, algorithms=["HS256"])
    return FileAccessTokenData.model_validate(content)

  def encode(self)->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.FileAccessTokenSecret)
    return jwt.encode(self.model_dump(), secret, algorithm="HS256")

def get_authorization_field(request: Request):
  header = request.headers.get('Authorization')
  if not header:
    raise ApiError("Expected Authorization header.", 401)
  
  authmatch: list[str] = re.findall('Bearer (.+)', header)
  if len(authmatch) == 0:
    raise ApiError("Expected JWT token in Authorization header.", 401)

  authorization: str = authmatch[0]
  return authorization

def authorize_api(request: Request)->ApiTokenData:
  authorization = get_authorization_field(request)
  try:
    token = ApiTokenData.decode(authorization)
  except jwt.DecodeError as e:
    raise ApiError("Unauthenticated.", 401)
  return token

def authorize_file(request: Request, album_id: str)->FileAccessTokenData:
  authorization = get_authorization_field(request)
  try:
    token = FileAccessTokenData.decode(authorization)
  except jwt.DecodeError as e:
    raise ApiError("Unauthenticated.", 401)
  
  if token.exp < datetime.datetime.now(datetime.timezone.utc):
    raise ApiError("File access token is expired.", 401)
  
  if token.album_id != album_id:
    raise ApiError("Album ID in JWT does not match actual album ID", 401)
  
  if os.path.exists(os.path.join(FilePaths.UserFiles,album_id)):
    raise ApiError("The folder for that album no longer exists!", 404)
  
  return token
  
ApiAuthDependency = Annotated[ApiTokenData, Depends(authorize_api)]
FileAuthDependency = Annotated[FileAccessTokenData, Depends(authorize_file)]
    
__all__ = [
  "ApiAuthDependency",
  "FileAuthDependency",
  "ApiTokenData",
  "FileAccessTokenData",
]