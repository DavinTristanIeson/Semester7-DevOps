import datetime
from enum import Enum
import pydantic
from sqlalchemy import Date, Float, ForeignKey, Integer, String

from models.sql import SQLBaseModel, UUID_column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import Any, Optional, Sequence

from models.user import UserModel


class ExpressionRecognitionTaskStatus(str, Enum):
  NotStarted = "not_started",
  Pending = "pending",
  Failed = "failed",
  Success = "success",

class ExpressionRecognitionTaskModel(SQLBaseModel):
  __tablename__ = "expression_recognition_tasks"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
  # For access
  business_id: Mapped[str] = UUID_column()
  user_id: Mapped[int] = mapped_column(Integer, ForeignKey(UserModel.id, ondelete="CASCADE", onupdate="CASCADE"), nullable=False)
  status: Mapped[ExpressionRecognitionTaskStatus] = mapped_column(String(36), nullable=False, default=ExpressionRecognitionTaskStatus.NotStarted.value)
  accessed_at: Mapped[datetime.datetime] = mapped_column(Date, nullable=False, default=lambda: datetime.datetime.now(datetime.timezone.utc))
  results: Mapped[list["ExpressionRecognitionTaskResultModel"]] = relationship("ExpressionRecognitionTaskResultModel", back_populates="task")
  error: Mapped[str] = mapped_column(String, nullable=True, default=None)

class ExpressionRecognitionTaskResultModel(SQLBaseModel):
  __tablename__ = "expression_recognition_task_results"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, nullable=False)
  filename: Mapped[str] = mapped_column(String(255), nullable=False)
  task_id = mapped_column(Integer, ForeignKey(ExpressionRecognitionTaskModel.id, onupdate="CASCADE", ondelete="CASCADE"), nullable=False)
  task: Mapped[ExpressionRecognitionTaskModel] = relationship("ExpressionRecognitionTaskModel", back_populates="results")

  # dimensionally-reduced x and y
  representative_x: Mapped[float] = mapped_column(Float, nullable=False)
  representative_y: Mapped[float] = mapped_column(Float, nullable=False)

  x0: Mapped[int] = mapped_column(Integer, nullable=False)
  x1: Mapped[int] = mapped_column(Integer, nullable=False)
  y0: Mapped[int] = mapped_column(Integer, nullable=False)
  y1: Mapped[int] = mapped_column(Integer, nullable=False)
  
  happy: Mapped[float] = mapped_column(Float, nullable=False)
  angry: Mapped[float] = mapped_column(Float, nullable=False)
  surprised: Mapped[float] = mapped_column(Float, nullable=False)
  disgusted: Mapped[float] = mapped_column(Float, nullable=False)
  sad: Mapped[float] = mapped_column(Float, nullable=False)
  neutral: Mapped[float] = mapped_column(Float, nullable=False)


# Resource    

class Point(pydantic.BaseModel):
  x: float
  y: float

class BoundingBox(pydantic.BaseModel):
  x0: int
  x1: int 
  y0: int
  y1: int

class FacialExpressionProbabilities(pydantic.BaseModel):
  happy: float
  angry: float
  surprised: float
  disgusted: float
  sad: float
  neutral: float

class ExpressionRecognitionTaskResultResource(pydantic.BaseModel):
  filename: str
  representative_point: Point
  bbox: BoundingBox
  probabilities: FacialExpressionProbabilities

  @staticmethod
  def from_model(model: ExpressionRecognitionTaskResultModel)->"ExpressionRecognitionTaskResultResource":
    return ExpressionRecognitionTaskResultResource(
      filename=model.filename,
      probabilities=FacialExpressionProbabilities(
        angry=model.angry,
        disgusted=model.disgusted,
        happy=model.happy,
        neutral=model.neutral,
        sad=model.sad,
        surprised=model.surprised,
      ),
      bbox=BoundingBox(
        x0=model.x0,
        x1=model.x1,
        y0=model.y0,
        y1=model.y1
      ),
      representative_point=Point(
        x=model.representative_x,
        y=model.representative_y,
      )
    )

class ExpressionRecognitionTaskResource(pydantic.BaseModel):
  model_config = pydantic.ConfigDict(use_enum_values=True)
  id: str
  status: ExpressionRecognitionTaskStatus
  results: Optional[list[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]

  @staticmethod
  def from_model(model: ExpressionRecognitionTaskModel)->"ExpressionRecognitionTaskResource":
    return ExpressionRecognitionTaskResource(
      id=model.business_id,
      status=model.status,
      error=model.error,
      results=(list(map(ExpressionRecognitionTaskResultResource.from_model, model.results))
        if model.results is not None else None),
    )


# Schema
class ExpressionRecognitionTaskUpdateSchema(pydantic.BaseModel):
  status: ExpressionRecognitionTaskStatus
  results: Optional[Sequence[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]
