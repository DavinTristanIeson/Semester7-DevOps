import datetime
from typing import Annotated
from fastapi import Depends, Request
import jwt
import pydantic

from common.constants import EnvironmentVariables
from controllers.exceptions import ApiError
from models.sql import SQLSession
from models.user import RefreshTokenModel, SessionTokenResource

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
    raise ApiError("Expected Authorization header.", 401)
  
  bearer, authorization = header.split(' ')
  if bearer != "Bearer":
    raise ApiError("Expected Bearer Authorization.", 401)
  
  if len(authorization) == 0:
    raise ApiError("Expected JWT token in Authorization header.", 401)
  
  try:
    token = SessionTokenData.decode(authorization)
  except jwt.DecodeError:
    raise ApiError("Unauthenticated.", 401)
  
  if token.exp > datetime.datetime.now():
    raise ApiError("Access token is expired", 401)
  
  return token

def jwt_refresh(token: SessionTokenData)->SessionTokenResource:
  with SQLSession.begin() as db:
    token_in_db = db.query(RefreshTokenModel)\
      .where(
        (RefreshTokenModel.id == token.user_id) &
        (token.exp < RefreshTokenModel.expiry)
      )\
      .first()
    
  if token_in_db is not None:
    return jwt_create(token.user_id)
  else:
    raise ApiError("Refresh token has expired", 401)

JWTAuthDependency = Annotated[SessionTokenData, Depends(jwt_authorize)]
    
__all__ = [
  "JWTAuthDependency",
  "jwt_create",
  "SessionTokenData",
]