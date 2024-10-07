import dotenv

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import controllers
import routes
import models

models.sql.SQLBaseModel.metadata.create_all(models.sql.engine)


app = FastAPI()
controllers.exceptions.register_error_handlers(app)

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
app.include_router(routes.auth.router, prefix='/api/auth')
app.include_router(routes.album.router, prefix='/api/albums')
# https://stackoverflow.com/questions/65916537/a-minimal-fastapi-example-loading-index-html
app.mount("/", StaticFiles(directory="../frontend/out", html = True), name="static")