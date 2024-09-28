import datetime
from typing import Annotated, Optional
from fastapi import Depends, Request, Response
import jwt
import pydantic
import sqlalchemy as sql

from common.constants import EnvironmentVariables
from models.base import SQLSession
from models.user import RefreshTokenModel
from resources.user import SessionTokenResource

class AuthenticationError(Exception):
  message: str
  def __init__(self, message = "Unauthenticated"):
    self.message = message

  @staticmethod
  def handler(request: Request, error: "AuthenticationError")->Response:
    return Response(content=error.message, status_code=401)

class SessionTokenData(pydantic.BaseModel):
  user_id: int
  exp: datetime.datetime

  @staticmethod
  def decode(token: str)->"SessionTokenData":
    secret = EnvironmentVariables.get(EnvironmentVariables.SessionSecret)
    content = jwt.decode(token, secret, algorithm="HS256")
    return SessionTokenData.model_validate(content)

  def encode(self)->str:
    secret = EnvironmentVariables.get(EnvironmentVariables.SessionSecret)
    return jwt.encode(self.model_dump(), secret, algorithm="HS256")



def jwt_create(user_id: int)->SessionTokenResource:
  access_token_exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
  refresh_token_exp = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=14)

  access_token = SessionTokenData(user_id=user_id, exp=access_token_exp)
  refresh_token = SessionTokenData(user_id=user_id, exp=refresh_token_exp)

  with SQLSession.begin() as db:
    new_token = RefreshTokenModel(id=user_id, token=refresh_token.encode(), expiry=refresh_token.exp)
    old_token = db.query(RefreshTokenModel).where(RefreshTokenModel.id == user_id).limit(1).first()
    if old_token is not None:
      old_token.expiry = new_token.expiry
      old_token.token = new_token.token
    else:
      db.add(new_token)

  return SessionTokenResource(
    access_token=access_token.encode(),
    refresh_token=refresh_token.encode()
  )

def jwt_authorize(request: Request)->SessionTokenData:
  header = request.headers.get('Authorization')
  if not header:
    raise AuthenticationError("Expected Authorization header.")
  
  bearer, authorization = header.split(' ')
  if bearer != "Bearer":
    raise AuthenticationError("Expected Bearer Authorization.")
  
  if len(authorization) == 0:
    raise AuthenticationError("Expected JWT token in Authorization header.")
  
  try:
    token = SessionTokenData.decode(authorization)
  except jwt.DecodeError:
    raise AuthenticationError()
  
  if token.exp > datetime.datetime.now():
    raise AuthenticationError("Access token is expired")
  
  return token

JWTAuthDependency = Annotated[SessionTokenData, Depends(jwt_authorize)]
    
__all__ = [
  "JWTAuthDependency",
  "jwt_create",
  "SessionTokenData",
  "AuthenticationError"
]