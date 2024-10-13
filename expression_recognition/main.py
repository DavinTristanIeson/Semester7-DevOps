import dotenv
dotenv.load_dotenv(override=True)

import routes
from common.constants import EnvironmentVariables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import controllers
import routes

app = FastAPI()
controllers.exceptions.register_error_handlers(app)

server_origin = EnvironmentVariables.get(EnvironmentVariables.ApiServerUrl)
app.add_middleware(
  CORSMiddleware,
  allow_origins=[server_origin],
  allow_methods=['*'],
  allow_headers=['*']
)
app.include_router(routes.tasks.router, prefix="/tasks")
