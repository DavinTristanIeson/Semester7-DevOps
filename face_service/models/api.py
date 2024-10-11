
from typing import Any, Generic, Optional, TypeVar
import pydantic

from fastapi import Query

T = TypeVar("T")

class ApiResult(pydantic.BaseModel, Generic[T]):
  data: T
  message: Optional[str]

class ApiErrorResult(pydantic.BaseModel):
  message: str
  errors: Optional[dict[str, Any]] = None
