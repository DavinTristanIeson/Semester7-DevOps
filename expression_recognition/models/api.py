
from typing import Any, Generic, Optional, TypeVar
from fastapi import Response
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import pydantic

T = TypeVar("T")


class ApiError(Exception):
  def __init__(self, message: str, status_code: int):
    self.message = message
    self.status_code = status_code

  def as_response(self)->Response:
    return JSONResponse(content=ApiErrorResult(message=self.message).model_dump(), status_code=self.status_code)
  
class ApiResult(pydantic.BaseModel, Generic[T]):
  data: T
  message: Optional[str]
  def as_json(self):
    return jsonable_encoder(self)

class ApiErrorResult(pydantic.BaseModel):
  message: str
  errors: Optional[dict[str, Any]] = None
  def as_json(self):
    return jsonable_encoder(self)