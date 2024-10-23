from contextlib import asynccontextmanager
import threading
import dotenv
dotenv.load_dotenv(override=True)

import routes
from common.constants import EnvironmentVariables
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import controllers
import routes


@asynccontextmanager
async def lifespan(app):
  controllers.tasks.initialize_queue()
  stop_event = threading.Event()
  services: list[threading.Thread] = []
  for _ in range(4):
    service = threading.Thread(target=controllers.expression.service, args=[controllers.tasks.ExpressionRecognitionTaskQueue, stop_event])
    service.start()
    services.append(service)
  yield
  stop_event.set()

app = FastAPI(lifespan=lifespan)
controllers.exceptions.register_error_handlers(app)


server_origin = EnvironmentVariables.get(EnvironmentVariables.ApiServerUrl)
app.add_middleware(
  CORSMiddleware,
  allow_origins=[server_origin],
  allow_methods=['*'],
  allow_headers=['*']
)
app.include_router(routes.tasks.router, prefix="/tasks")

