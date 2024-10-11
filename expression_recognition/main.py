import dotenv
import routes

dotenv.load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import controllers
import routes

app = FastAPI()
controllers.exceptions.register_error_handlers(app)

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
app.include_router(routes.auth.router)
app.include_router(routes.tasks.router)
