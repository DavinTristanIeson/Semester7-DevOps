from typing import Annotated
from fastapi import Depends, Request
import pydantic
import re
import jwt

from common.constants import EnvironmentVariables
from controllers.exceptions import ApiError

class ExpressionRecognitionApiTokenData(pydantic.BaseModel):
  issuer: str
  
  @staticmethod
  def token()->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.FaceServiceApiSecret)
    content = jwt.encode(ExpressionRecognitionApiTokenData(issuer="Expression Recognition Service").model_dump(), secret, algorithm="HS256")
    return content
  
  @staticmethod
  def verify(token: str)->"ExpressionRecognitionApiTokenData":
    secret = EnvironmentVariables.get(EnvironmentVariables.FaceServiceApiSecret)
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

  
ExpressionRecognitionApiAuthDependency = Annotated[ExpressionRecognitionApiTokenData, Depends(jwt_authorize)]
    
__all__ = [
  "ExpressionRecognitionApiAuthDependency",
  "ExpressionRecognitionApiTokenData",
]