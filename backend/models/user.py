from models.base import SQLBaseModel
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String

class UserModel(SQLBaseModel):
  __tablename__ = "accounts"
  id: Mapped[int] = mapped_column(primary_key=True)
  email: Mapped[str] = mapped_column(String(255))
  # hashed
  password: Mapped[str] = mapped_column(String(255))
  salt: Mapped[str] = mapped_column(String(255))
