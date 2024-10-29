
import datetime
import apscheduler
import apscheduler.triggers
import apscheduler.triggers.interval
from fastapi import UploadFile
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

def create_task(user_id: int):
  with SQLSession.begin() as db:
    task = ExpressionRecognitionTaskModel(
      user_id=user_id
    )
    db.add(task)
    db.flush()
    task.results
    db.expunge_all()

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
          filename=result.filename,
          x0=result.bbox.x0,
          x1=result.bbox.x1,
          y0=result.bbox.y0,
          y1=result.bbox.y1,
          width=result.width,
          height=result.height,
          happy=result.probabilities.happy,
          angry=result.probabilities.angry,
          surprised=result.probabilities.surprised,
          disgusted=result.probabilities.disgusted,
          sad=result.probabilities.sad,
          neutral=result.probabilities.neutral,
        ))
    
    if payload.error is not None:
      task.error = payload.error

async def check_acknowledged_task():
  with SQLSession() as db:
    tasks = db.query(ExpressionRecognitionTaskModel).where(
      # Max preserve for a day
      ExpressionRecognitionTaskModel.accessed_at < (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1))
    ).all()
    for task in tasks:
      db.delete(task)
  
scheduler.add_job(check_acknowledged_task, apscheduler.triggers.interval.IntervalTrigger(days=1))