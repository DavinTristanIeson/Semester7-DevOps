import os
from enum import Enum
from typing import cast

class EnvironmentVariables(str, Enum):
  FaceServiceApiSecret = "FACE_SERVICE_API_SECRET"
  ApiServerUrl = "API_SERVER_URL"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
  
DATA_PATH = 'data'
TIMESTAMP_SEPARATOR = "__"

class FilePaths:
  Data = DATA_PATH
  TemporaryWorkingDirectory = os.path.join(DATA_PATH, 'tempwd')
  Queue = os.path.join(DATA_PATH, "queue")