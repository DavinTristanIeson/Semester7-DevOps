from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi_jwt_auth.exceptions import AuthJWTException
from models.jwt import authjwt_exception_handler

import dotenv
dotenv.load_dotenv()

from routes import auth_router


app = FastAPI()
app.exception_handler(AuthJWTException)(authjwt_exception_handler)

app.mount('/api/auth', auth_router)
# https://stackoverflow.com/questions/65916537/a-minimal-fastapi-example-loading-index-html
app.mount("/", StaticFiles(directory="../frontend/out", html = True), name="static")