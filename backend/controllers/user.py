from fastapi import HTTPException
from controllers.exceptions import ApiError
from models.sql import SQLSession
from models.user import AuthSchema, UserModel, UserResource

import bcrypt

def get_user(id: int)->UserResource:
  with SQLSession.begin() as db:
    user = db.query(UserModel)\
      .where(UserModel.id == id)\
      .first()
    
    db.expunge_all()
    
  if user is None:
    raise ApiError("User not found.", 404)
  return UserResource(id=user.id, email=user.email)

def get_user_by_auth(auth: AuthSchema)->UserResource:
  with SQLSession.begin() as db:
    user = db.query(UserModel)\
      .where(
        (UserModel.email == auth.email)
      )\
      .first()
    db.expunge_all()
    
  exc = ApiError("Email or password is wrong", 403)
  if user is None:
    raise exc
  if not bcrypt.checkpw(auth.password.encode(), user.password):
    raise exc
  return UserResource(id=user.id, email=user.email)

def create_user(schema: AuthSchema)->UserResource:
  with SQLSession.begin() as db:
    check_user = db.query(UserModel)\
      .where(UserModel.email == schema.email)\
      .first()
    
    if check_user is not None:
      raise ApiError("Email is already in use", 400)
    
    new_user = UserModel(
      email=schema.email,
      password=bcrypt.hashpw(schema.password.encode(), bcrypt.gensalt())
    )
    db.add(new_user)
    db.flush()
    user = db.query(UserModel)\
      .where(UserModel.email == schema.email)\
      .first()
        
    if user is None:
      raise ApiError("User is not successfully created", 500)
    
    db.expunge_all()
  
  return UserResource(id=user.id, email=user.email)