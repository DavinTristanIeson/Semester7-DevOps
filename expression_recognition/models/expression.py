from enum import Enum
import pydantic
from typing import Any, Optional, Sequence

class ExpressionRecognitionTaskStatus(str,Enum):
  NotStarted = "not_started",
  Pending = "pending",
  Failed = "failed",
  Success = "success",

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

class ExpressionRecognitionTaskResource(pydantic.BaseModel):
  id: str
  status: ExpressionRecognitionTaskStatus
  data: Optional[list[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]

# Schema
class ExpressionRecognitionTaskUpdateSchema(pydantic.BaseModel):
  status: ExpressionRecognitionTaskStatus
  results: Optional[Sequence[ExpressionRecognitionTaskResultResource]]
  error: Optional[str]
