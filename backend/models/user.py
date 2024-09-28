import datetime
from typing import Optional
from models.base import SQLBaseModel, SQLSession
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Date, ForeignKey, Integer, String

class UserModel(SQLBaseModel):
  __tablename__ = "accounts"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  email: Mapped[str] = mapped_column(String(255))
  # hashed
  password: Mapped[str] = mapped_column(String(255))
  salt: Mapped[str] = mapped_column(String(255))

class RefreshTokenModel(SQLBaseModel):
  __tablename__ = "refresh_tokens"
  id: Mapped[int] = mapped_column(ForeignKey(f"{UserModel.__tablename__}.id"), primary_key=True,)
  token: Mapped[str] = mapped_column(String(255))
  expiry: Mapped[Date] = mapped_column(Date())