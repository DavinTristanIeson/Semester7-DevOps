from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import pydantic

from common.constants import EnvironmentVariables

# callback to get your configuration
@AuthJWT.load_config
def get_config():
  secret = EnvironmentVariables.get(EnvironmentVariables.SessionSecret)
  return [("authjwt_secret_key", secret)]

# exception handler for authjwt
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
  return JSONResponse(
    status_code=exc.status_code, # type: ignore
    content={"detail": exc.message} # type: ignore
  )
