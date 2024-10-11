import httpx

from controllers.auth import ExpressionRecognitionApiTokenData
from models.expression import ExpressionRecognitionTaskUpdateSchema


client = httpx.AsyncClient(
  headers={
    "Authorization": f"Bearer {ExpressionRecognitionApiTokenData.token()}",
    "Content-Type": "application/json"
  }
)

def update_task(payload: ExpressionRecognitionTaskUpdateSchema):
  try:
    client.patch()