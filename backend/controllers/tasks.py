
import datetime
from fastapi import UploadFile
import rocketry.conds
from common.asynchronous import TaskTracker, scheduler
import controllers
from controllers.exceptions import ApiError
from models.expression import ExpressionRecognitionTaskModel, ExpressionRecognitionTaskResource, ExpressionRecognitionTaskResultModel, ExpressionRecognitionTaskUpdateSchema
from models.sql import SQLSession

def get_task(id: str, user_id: int)->ExpressionRecognitionTaskResource:
  with SQLSession.begin() as db:
    task = db.query(ExpressionRecognitionTaskModel).where(ExpressionRecognitionTaskModel.business_id == id).first()
    if task is None:
      raise ApiError(f"Task with id {id} doesn't exist", 404)
    if task.user_id != user_id:
      raise ApiError("You do not have permission to access the results of this task.", 401)
    task.accessed_at = datetime.datetime.now(datetime.timezone.utc)
    db.flush()
    task.results
    db.expunge_all()
  return ExpressionRecognitionTaskResource.from_model(task)

def create_task(file: UploadFile, user_id: int):
  with SQLSession.begin() as db:
    task = ExpressionRecognitionTaskModel(
      user_id=user_id
    )
    db.add(task)
    db.flush()
    db.expunge_all()

  TaskTracker().enqueue(
    controllers.expression_recognition_service.forward_task(task.business_id, file)
  )
  return ExpressionRecognitionTaskResource.from_model(task)

def update_task(id: str, payload: ExpressionRecognitionTaskUpdateSchema):
  with SQLSession.begin() as db:
    task = db.query(ExpressionRecognitionTaskModel).where(ExpressionRecognitionTaskModel.business_id == id).first()
    if task is None:
      raise ApiError(f"Task with id {id} doesn't exist", 404)
    task.status = payload.status
    if payload.results is not None:
      for result in payload.results:
        db.add(ExpressionRecognitionTaskResultModel(
          task_id=task.id,
          **result.model_dump(),
        ))
    
    if payload.error is not None:
      task.error = payload.error

@scheduler.task(rocketry.conds.daily)
async def check_acknowledged_task():
  with SQLSession() as db:
    tasks = db.query(ExpressionRecognitionTaskModel).where(
      # Max preserve for a day
      ExpressionRecognitionTaskModel.accessed_at < (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1))
    ).all()
    for task in tasks:
      db.delete(task)
  