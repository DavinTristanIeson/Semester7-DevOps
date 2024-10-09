import datetime
import pydantic
from sqlalchemy import DateTime, Integer, String
from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column
import os

# Model
class FileModel(SQLBaseModel):
  __tablename__ = "files"
  id: Mapped[int] = mapped_column(Integer, autoincrement=True, primary_key=True)
  business_id: Mapped[str] = UUID_column()
  path: Mapped[str] = mapped_column(String(255))
  created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

# Resource
class FileResource(pydantic.BaseModel):
  id: str
  name: str
  created_at: datetime.datetime
  @staticmethod
  def from_model(model: FileModel):
    return FileResource(
      id=model.business_id,
      name=os.path.basename(model.path),
      created_at=model.created_at
    )