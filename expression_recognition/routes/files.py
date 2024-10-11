from fastapi import APIRouter

from controllers.auth import ExpressionRecognitionApiAuthDependency, FileAuthDependency

router = APIRouter()

@router.post('/[id]')
def post__files(auth: ExpressionRecognitionApiAuthDependency, file):
  pass

@router.patch('/[id]/delete')
def delete__files(auth: ExpressionRecognitionApiAuthDependency, payload: DeleteTaskResultsSchema):
  pass