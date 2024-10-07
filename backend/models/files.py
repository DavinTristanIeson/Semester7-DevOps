import datetime
from typing import Optional
from sqlalchemy import Boolean, Date, DateTime, Integer, String
from models.sql import SQLBaseModel
from sqlalchemy.orm import Mapped, mapped_column

class FileModel(SQLBaseModel):
  id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
  path: Mapped[str] = mapped_column(String(255))
  created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default_factory=lambda: datetime.datetime.now(datetime.timezone.utc))
