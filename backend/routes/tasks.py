
import io
from tempfile import TemporaryFile
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
from common.asynchronous import TaskTracker
import controllers
from controllers.auth import JWTAuthDependency
import zipfile
from controllers.exceptions import ApiError
from controllers.expression_recognition_service import ExpressionRecognitionApiAuthDependency
from models.api import ApiResult
from models.expression import ExpressionRecognitionTaskUpdateSchema
from routes.auth import router

router = APIRouter()

@router.post('')
async def post__task(auth: JWTAuthDependency, file: UploadFile = File()):
  # Work around from https://stackoverflow.com/questions/64788026/cant-open-and-read-content-of-an-uploaded-zip-file-with-fastapi
  tempfile = TemporaryFile('w+b')
  tempfile.write(await file.read())
  test_zip_file = zipfile.ZipFile(tempfile, 'r')
  try:
    ret = test_zip_file.testzip()
    if ret is not None:
      raise ApiError(f"Found corrupt file in uploaded zip file: {ret}", 400)
  except Exception as e:
    print(e)
    raise ApiError("Uploaded zip file is corrupted, invalid, or not an actual zip file.", 400)

  user = controllers.user.get_user(auth.user_id)
  task = controllers.tasks.create_task(user.id)
  TaskTracker().enqueue(
    controllers.expression_recognition_service.forward_task(task.id, file)
  )
  return JSONResponse(
    content=ApiResult(message="Our algorithms will now analyze the faces in your images. This may take some time.\
      Please do not turn off your computer or close this site or the images that you have uploaded will disappear.", data = task).as_json(),
    status_code=201
  )

@router.post('/[id]')
def get__task(auth: JWTAuthDependency, id: str):
  user = controllers.user.get_user(auth.user_id)
  task = controllers.tasks.get_task(id, user.id)
  return ApiResult(message=None, data=task)

# Only accessible from Expression Recognition API
@router.patch('/[id]')
async def update__tasks(auth: ExpressionRecognitionApiAuthDependency, id: str, body: ExpressionRecognitionTaskUpdateSchema):
  controllers.tasks.update_task(id, body)
  return JSONResponse(
    content=ApiResult(data=None, message="Successfully updated task status").as_json()
  )
