from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

import controllers
from controllers.auth import JWTAuthDependency
from models.api import ApiResult
from models.user import AuthSchema, RefreshTokenSchema, UserResource

router = APIRouter() 

@router.get('/me')
async def get__me(auth: controllers.auth.JWTAuthDependency):
  return ApiResult(
    data=UserResource.from_model(controllers.user.get_user(auth.user_id)),
    message=None
  )

@router.post('/login')
async def post__login(body: AuthSchema):
  user = controllers.user.get_user_by_auth(body)
  return ApiResult(data=controllers.auth.jwt_create(user), message=None)

@router.post('/refresh')
async def post__refresh(token: RefreshTokenSchema):
  session_token = controllers.auth.SessionTokenData.decode(token.refresh_token, controllers.auth.SessionTokenType.RefreshToken)
  return ApiResult(data=controllers.auth.jwt_refresh(session_token), message="Refreshed token successfully.")

@router.post('/register')
async def post__register(body: AuthSchema):
  user = controllers.user.create_user(body)
  content = controllers.auth.jwt_create(user)

  return JSONResponse(
    content=ApiResult(data=content, message="Registered account successfully.").model_dump(),
    status_code=201
  )

@router.post('/logout')
async def post__logout(auth: JWTAuthDependency):
  controllers.auth.jwt_revoke(auth.user_id)
  return ApiResult(data=None, message="You have been logged out from your account on all devices.").model_dump()

__all__ = [
  "router"
]