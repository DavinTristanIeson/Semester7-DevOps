import io
import zipfile
from fastapi import APIRouter, File, Request, UploadFile
from fastapi.responses import JSONResponse

from controllers.auth import ExpressionRecognitionApiAuthDependency
import controllers.tasks
from models.api import ApiResult

router = APIRouter()

@router.post('/{id}')
async def post__tasks(auth: ExpressionRecognitionApiAuthDependency, id: str, request: Request):
  bytesdata = await request.body()
  bytestream = io.BytesIO(bytesdata)
  # Assume that the file is a valid zip file
  await controllers.tasks.enqueue_task_file(id, bytestream)
  return JSONResponse(
    content=ApiResult(data=None, message="Successfully saved task").as_json(),
    status_code=201
  )