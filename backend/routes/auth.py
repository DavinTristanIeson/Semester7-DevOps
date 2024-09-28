from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from fastapi.security import HTTPAuthorizationCredentials

import controllers
from models.base import SQLSession
from models.user import RefreshTokenModel
from resources.user import AuthSchema, UserResource, SessionTokenResource

router = APIRouter() 

@router.get('/me')
async def get__me(auth: controllers.auth.JWTAuthDependency)->UserResource:
  return UserResource(id=auth.user_id, email='')

@router.post('/login')
async def post__login(body: AuthSchema):
  if body.email != "test" or body.password != "test":
    raise HTTPException(status_code=403, detail="Invalid username or password")

  # subject identifier for who this token is for example id or username from database
  id = 0
  return controllers.auth.jwt_create(id)

@router.post('/refresh')
async def post__refresh(auth: controllers.auth.JWTAuthDependency):
  with SQLSession.begin() as db:
    token = db.query(RefreshTokenModel)\
      .where(
        (RefreshTokenModel.id == auth.user_id) &
        (auth.exp < RefreshTokenModel.expiry)
      )\
      .first()
    
  if token is None:
    raise controllers.auth.AuthenticationError("Refresh token is expired.")

  id = 0
  return controllers.auth.jwt_create(id)


@router.post('/register')
async def post__register(body: AuthSchema):
  id = 0
  content = controllers.auth.jwt_create(id)

  return Response(
    content=content.model_dump_json(),
    status_code=201
  )


__all__ = [
  "router"
]