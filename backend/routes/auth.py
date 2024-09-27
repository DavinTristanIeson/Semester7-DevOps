from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import HTMLResponse
from fastapi_jwt_auth import AuthJWT

from resources.user import UserMutationSchema, UserResource, SessionTokenResource

router = APIRouter() 

@router.get('me')
async def get__me(Authorize: AuthJWT = Depends())->UserResource:
  Authorize.jwt_required()
  current_user = Authorize.get_jwt_subject()
  return UserResource(id='', email='')

@router.post('login')
async def post__login(user: UserMutationSchema, Authorize: AuthJWT = Depends()):
  if user.email != "test" or user.password != "test":
    raise HTTPException(status_code=400, detail="Invalid username or password")

  # subject identifier for who this token is for example id or username from database
  id = ''
  access_token = Authorize.create_access_token(subject=id)
  refresh_token = Authorize.create_refresh_token(subject=id)
  return SessionTokenResource(access_token=access_token, refresh_token=refresh_token)

@router.post('refresh')
async def post__refresh(Authorize: AuthJWT = Depends()):
  Authorize.jwt_refresh_token_required()
  id = ''
  access_token = Authorize.create_access_token(subject=id)
  refresh_token = Authorize.create_refresh_token(subject=id)
  return SessionTokenResource(access_token=access_token, refresh_token=refresh_token)


@router.post('register')
async def post__register(Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  id = ''
  access_token = Authorize.create_access_token(subject=id)
  refresh_token = Authorize.create_refresh_token(subject=id)

  return Response(
    content=SessionTokenResource(access_token=access_token, refresh_token=refresh_token),
    status_code=201
  )


__all__ = [
  "router"
]