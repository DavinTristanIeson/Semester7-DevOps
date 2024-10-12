import pydantic
from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey, Integer, String

# Models
class UserModel(SQLBaseModel):
  __tablename__ = "users"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  business_id: Mapped[str] = UUID_column()
  username: Mapped[str] = mapped_column(String(255))
  # hashed
  password: Mapped[bytes] = mapped_column(String(255))

class RefreshTokenModel(SQLBaseModel):
  __tablename__ = "refresh_tokens"
  id: Mapped[int] = mapped_column(ForeignKey(UserModel.id), primary_key=True,)
  token: Mapped[str] = mapped_column(String(255))
  expiry: Mapped[Date] = mapped_column(Date())


# Resource
class UserResource(pydantic.BaseModel):
  id: str
  username: str
  
  @staticmethod
  def from_model(model: UserModel)->"UserResource":
    return UserResource(id=model.business_id, username=model.username)

class SessionTokenResource(pydantic.BaseModel):
  access_token: str
  refresh_token: str


# Schema
class RefreshTokenSchema(pydantic.BaseModel):
  refresh_token: str

class AuthSchema(pydantic.BaseModel):
  username: str = pydantic.Field(min_length=5, max_length=32, pattern=r"[a-zA-Z0-9]+")
  password: str = pydantic.Field(min_length=8, max_length=32)
  