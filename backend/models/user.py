import datetime
from typing import Optional

import pydantic
from models.sql import SQLBaseModel, SQLSession
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Date, ForeignKey, Integer, String

# Models
class UserModel(SQLBaseModel):
  __tablename__ = "accounts"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  email: Mapped[str] = mapped_column(String(255))
  # hashed
  password: Mapped[bytes] = mapped_column(String(255))

class RefreshTokenModel(SQLBaseModel):
  __tablename__ = "refresh_tokens"
  id: Mapped[int] = mapped_column(ForeignKey(f"{UserModel.__tablename__}.id"), primary_key=True,)
  token: Mapped[str] = mapped_column(String(255))
  expiry: Mapped[Date] = mapped_column(Date())


# Resource
class UserResource(pydantic.BaseModel):
  id: int
  email: str

class SessionTokenResource(pydantic.BaseModel):
  access_token: str
  refresh_token: str


# Schema
class RefreshTokenSchema(pydantic.BaseModel):
  refresh_token: str

class AuthSchema(pydantic.BaseModel):
  email: pydantic.EmailStr
  password: str = pydantic.Field(min_length=8)
