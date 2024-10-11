import datetime
import pydantic
from sqlalchemy import Date, Enum, Float, ForeignKey, Integer, String

from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import Any, Optional, Sequence

from models.user import UserModel


class ExpressionRecognitionTaskStatus(str,Enum):
  NotStarted = "not_started",
  Pending = "pending",
  Failed = "failed",
  Success = "success",

class ExpressionRecognitionTaskModel(SQLBaseModel):
  __tablename__ = "expression_recognition_tasks"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
  # For access
  business_id: Mapped[str] = UUID_column()
  user_id: Mapped[int] = mapped_column(Integer, ForeignKey(UserModel.id, ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
  status: Mapped[ExpressionRecognitionTaskStatus] = mapped_column(String(36), nullable=False, default=ExpressionRecognitionTaskStatus.NotStarted)
  accessed_at: Mapped[datetime.datetime] = mapped_column(Date, nullable=False, default=lambda: datetime.datetime.now(datetime.timezone.utc))
  results: Mapped[list["ExpressionRecognitionTaskResultModel"]] = relationship("ExpressionRecognitionTaskResultModel", back_populates="results")
  error: Mapped[str] = mapped_column(String, nullable=True, default=None)

class ExpressionRecognitionTaskResultModel(SQLBaseModel):
  __tablename__ = "expression_recognition_task_results"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, nullable=False)
  filename: Mapped[str] = mapped_column(String(255), primary_key=True, nullable=False)
  task_id = mapped_column(Integer, ForeignKey(ExpressionRecognitionTaskModel.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
  task: Mapped[ExpressionRecognitionTaskModel] = relationship("ExpressionRecognitionTaskModel", back_populates="results")

  x0: Mapped[int] = mapped_column(Integer, nullable=False)
  x1: Mapped[int] = mapped_column(Integer, nullable=False)
  y0: Mapped[int] = mapped_column(Integer, nullable=False)
  y1: Mapped[int] = mapped_column(Integer, nullable=False)
  width: Mapped[int] = mapped_column(Integer, nullable=False)
  height: Mapped[int] = mapped_column(Integer, nullable=False)
  
  happiness: Mapped[float] = mapped_column(Float, nullable=False)
  anger: Mapped[float] = mapped_column(Float, nullable=False)
  surprise: Mapped[float] = mapped_column(Float, nullable=False)
  disgust: Mapped[float] = mapped_column(Float, nullable=False)
  sadness: Mapped[float] = mapped_column(Float, nullable=False)
  neutral: Mapped[float] = mapped_column(Float, nullable=False)


# Resource    
class ExpressionRecognitionTaskResultResource(pydantic.BaseModel):
  filename: str

  x0: int
  x1: int 
  y0: int 
  y1: int
  width: int
  height: int

  happiness: float
  anger: float
  surprise: float
  disgust: float
  sadness: float
  neutral: float
  @staticmethod
  def from_model(model: ExpressionRecognitionTaskResultModel)->"ExpressionRecognitionTaskResultResource":
    return ExpressionRecognitionTaskResultResource(
      filename=model.filename,
      anger=model.anger,
      disgust=model.disgust,
      happiness=model.happiness,
      height=model.height,
      neutral=model.neutral,
      sadness=model.sadness,
      surprise=model.surprise,
      width=model.width,
      x0=model.x0,
      x1=model.x1,
      y0=model.y0,
      y1=model.y1
    )

class ExpressionRecognitionTaskResource(pydantic.BaseModel):
  id: str
  status: ExpressionRecognitionTaskStatus
  data: Optional[list[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]

  @staticmethod
  def from_model(model: ExpressionRecognitionTaskModel)->"ExpressionRecognitionTaskResource":
    return ExpressionRecognitionTaskResource(
      id=model.business_id,
      status=model.status,
      error=model.error,
      data=(list(map(ExpressionRecognitionTaskResultResource.from_model, model.results))
        if model.results is not None else None),
    )


# Schema
class ExpressionRecognitionTaskUpdateSchema(pydantic.BaseModel):
  status: ExpressionRecognitionTaskStatus
  results: Optional[Sequence[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]
