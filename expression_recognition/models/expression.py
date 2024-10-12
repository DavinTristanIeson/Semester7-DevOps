from enum import Enum
import pydantic
from typing import Any, Optional, Sequence

class ExpressionRecognitionTaskStatus(str,Enum):
  NotStarted = "not_started",
  Pending = "pending",
  Failed = "failed",
  Success = "success",

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

class ExpressionRecognitionTaskResource(pydantic.BaseModel):
  model_config = pydantic.ConfigDict(use_enum_values=True)
  id: str
  status: ExpressionRecognitionTaskStatus
  results: Optional[list[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]

# Schema
class ExpressionRecognitionTaskUpdateSchema(pydantic.BaseModel):
  status: ExpressionRecognitionTaskStatus
  results: Optional[Sequence[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]
