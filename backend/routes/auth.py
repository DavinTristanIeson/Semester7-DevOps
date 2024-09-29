from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

import controllers
from models.api import ApiResult
from models.user import AuthSchema, UserResource

router = APIRouter() 

@router.get('/me')
async def get__me(auth: controllers.auth.JWTAuthDependency)->UserResource:
  return controllers.user.get_user(auth.user_id)

@router.post('/login')
async def post__login(body: AuthSchema):
  user = controllers.user.get_user_by_auth(body)
  return ApiResult(data=controllers.auth.jwt_create(user.id), message=None)

@router.post('/refresh')
async def post__refresh(auth: controllers.auth.JWTAuthDependency):    
  return ApiResult(data=controllers.auth.jwt_refresh(auth), message="Refreshed token successfully.")

@router.post('/register')
async def post__register(body: AuthSchema):
  user = controllers.user.create_user(body)
  content = controllers.auth.jwt_create(user.id)

  return JSONResponse(
    content=ApiResult(data=content, message="Registered account successfully.").model_dump_json(),
    status_code=201
  )


__all__ = [
  "router"
]