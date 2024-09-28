import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import controllers
import routes
import models

models.base.SQLBaseModel.metadata.create_all(models.base.engine)


app = FastAPI()
app.exception_handler(controllers.auth.AuthenticationError)(
  controllers.auth.AuthenticationError.handler
)

app.include_router(routes.auth.router, prefix='/api/auth')
# https://stackoverflow.com/questions/65916537/a-minimal-fastapi-example-loading-index-html
app.mount("/", StaticFiles(directory="../frontend/out", html = True), name="static")