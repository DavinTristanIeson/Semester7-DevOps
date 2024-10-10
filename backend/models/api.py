
from typing import Any, Generic, Optional, TypeVar
import pydantic

from fastapi import Query
from fastapi_pagination import Page
from fastapi_pagination.customization import CustomizedPage, UseName, UseFieldsAliases, UseParamsFields

T = TypeVar("T")

class ApiResult(pydantic.BaseModel, Generic[T]):
  data: T
  message: Optional[str]

class ApiErrorResult(pydantic.BaseModel):
  message: str
  errors: Optional[dict[str, Any]] = None

PaginatedApiResult = CustomizedPage[
  Page[T],
  UseParamsFields(
    page=Query(1, ge=1),
    size=Query(15, ge=1),
  ),
  UseFieldsAliases(
    items="data",
  )
]