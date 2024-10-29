import os
from enum import Enum
from typing import cast

class EnvironmentVariables(str, Enum):
  ExpressionRecognitionApiSecret = "EXPRESSION_RECOGNITION_API_SECRET"
  ExpressionRecognitionApiUrl = "EXPRESSION_RECOGNITION_API_URL"
  ApiServerUrl = "API_SERVER_URL"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
  
TIMESTAMP_SEPARATOR = "__"
class FilePaths:
  TempData = 'temp'