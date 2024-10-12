
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import controllers
from controllers.auth import JWTAuthDependency
import zipfile
from controllers.exceptions import ApiError
from controllers.expression_recognition_service import ExpressionRecognitionApiAuthDependency
from models.api import ApiResult
from models.expression import ExpressionRecognitionTaskUpdateSchema
from routes.auth import router

router = APIRouter()

@router.post('/')
def post__task(auth: JWTAuthDependency, file: UploadFile = File()):
  test_zip_file = zipfile.ZipFile(file.file)
  try:
    ret = test_zip_file.testzip()
    if ret is not None:
      raise ApiError(f"Found corrupt file in uploaded zip file: {ret}", 400)
  except Exception as e:
    raise ApiError("Uploaded zip file is corrupted, invalid, or not an actual zip file.", 400)

  user = controllers.user.get_user(auth.user_id)
  task = controllers.tasks.create_task(file, user.id)
  return JSONResponse(
    content=ApiResult(message="Our algorithms will now analyze the faces in your images. This may take some time.\
      Please do not turn off your computer or close this site or the images that you have uploaded will disappear.", data = task).as_json(),
    status_code=201
  )

@router.post('/[id]')
def get__task(auth: JWTAuthDependency, id: str):
  user = controllers.user.get_user(auth.user_id)
  task = controllers.tasks.get_task(id, user.id)
  return ApiResult(message=None, data = task)

@router.patch('/[id]')
async def update__tasks(auth: ExpressionRecognitionApiAuthDependency, id: str, body: ExpressionRecognitionTaskUpdateSchema):
  # Assume that the file is a valid zip file
  return JSONResponse(
    content=ApiResult(data=None, message="Successfully saved task").as_json()
  )
