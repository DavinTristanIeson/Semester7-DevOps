from typing import TYPE_CHECKING
import pydantic
from models.sql import SQLBaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey, Integer, String

if TYPE_CHECKING:
  from models.album import AlbumModel

# Models
class UserModel(SQLBaseModel):
  __tablename__ = "users"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  email: Mapped[str] = mapped_column(String(255))
  # hashed
  password: Mapped[bytes] = mapped_column(String(255))
  albums: Mapped[list["AlbumModel"]] = relationship('AlbumModel', back_populates='user')

class RefreshTokenModel(SQLBaseModel):
  __tablename__ = "refresh_tokens"
  id: Mapped[int] = mapped_column(ForeignKey(UserModel.id), primary_key=True,)
  token: Mapped[str] = mapped_column(String(255))
  expiry: Mapped[Date] = mapped_column(Date())


# Resource
class UserResource(pydantic.BaseModel):
  id: int
  email: str
  
  @staticmethod
  def from_model(model: UserModel)->"UserResource":
    return UserResource(id=model.id, email=model.email)

class SessionTokenResource(pydantic.BaseModel):
  access_token: str
  refresh_token: str


# Schema
class RefreshTokenSchema(pydantic.BaseModel):
  refresh_token: str

class AuthSchema(pydantic.BaseModel):
  email: pydantic.EmailStr
  password: str = pydantic.Field(min_length=8)
  