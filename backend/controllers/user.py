from fastapi import HTTPException
from controllers.exceptions import ApiError
from models.sql import SQLSession
from models.user import AuthSchema, UserModel, UserResource

import bcrypt

def get_user(id: str)->UserModel:
  with SQLSession() as db:
    user = db.query(UserModel)\
      .where(UserModel.business_id == id)\
      .first()
    
    db.expunge_all()
    
  if user is None:
    raise ApiError("User not found.", 404)
  return user

def get_user_by_auth(auth: AuthSchema)->UserResource:
  with SQLSession() as db:
    user = db.query(UserModel)\
      .where(
        (UserModel.username == auth.username)
      )\
      .first()
    db.expunge_all()
    
  exc = ApiError("Username or password is wrong", 403)
  if user is None:
    raise exc
  if not bcrypt.checkpw(auth.password.encode(), user.password):
    raise exc
  return UserResource.from_model(user)

def create_user(schema: AuthSchema)->UserResource:
  with SQLSession.begin() as db:
    check_user = db.query(UserModel)\
      .where(UserModel.username == schema.username)\
      .first()
    
    if check_user is not None:
      raise ApiError("Username is already in use", 400)
    
    new_user = UserModel(
      username=schema.username,
      password=bcrypt.hashpw(schema.password.encode(), bcrypt.gensalt())
    )
    db.add(new_user)
    db.flush()
    user = db.query(UserModel)\
      .where(UserModel.username == schema.username)\
      .first()
        
    if user is None:
      raise ApiError("User is not successfully created", 500)
    
    db.expunge_all()
  
  return UserResource.from_model(user)