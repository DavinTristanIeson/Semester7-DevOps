import datetime
from sqlalchemy import Date, DateTime, Integer, String
from models.sql import SQLBaseModel
from sqlalchemy.orm import Mapped, mapped_column

class FileModel(SQLBaseModel):
  id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
  path: Mapped[str] = mapped_column(String(255))
  created_at: Mapped[DateTime] = mapped_column(DateTime, default_factory=lambda: datetime.datetime.now())
  accessed_at: Mapped[DateTime] = mapped_column(DateTime, default_factory=lambda: datetime.datetime.now())