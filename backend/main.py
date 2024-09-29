import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import controllers
import routes
import models

models.sql.SQLBaseModel.metadata.create_all(models.sql.engine)


app = FastAPI()
controllers.exceptions.register_error_handlers(app)

app.include_router(routes.auth.router, prefix='/api/auth')
# https://stackoverflow.com/questions/65916537/a-minimal-fastapi-example-loading-index-html
app.mount("/", StaticFiles(directory="../frontend/out", html = True), name="static")