import dotenv
dotenv.load_dotenv(override=True)

from common.constants import EnvironmentVariables
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import controllers
import routes
import models
from common.asynchronous import scheduler

models.sql.SQLBaseModel.metadata.create_all(models.sql.engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
  scheduler.start()
  yield

app = FastAPI(lifespan=lifespan)
controllers.exceptions.register_error_handlers(app)

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])

app.include_router(routes.auth.router, prefix='/api/auth')
app.include_router(routes.tasks.router, prefix='/api/tasks')
# https://stackoverflow.com/questions/65916537/a-minimal-fastapi-example-loading-index-html
app.mount("/", StaticFiles(directory="views", html = True), name="static")
