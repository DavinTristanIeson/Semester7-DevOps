from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

from controllers.auth import ExpressionRecognitionApiAuthDependency
import controllers.files
from models.api import ApiResult

router = APIRouter()

@router.post('/[id]')
async def post__tasks(auth: ExpressionRecognitionApiAuthDependency, id: str, file: UploadFile = File()):
  # Assume that the file is a valid zip file
  await controllers.files.enqueue_task_file(id, file)
  return JSONResponse(
    content=ApiResult(data=None, message="Successfully saved task").as_json()
  )