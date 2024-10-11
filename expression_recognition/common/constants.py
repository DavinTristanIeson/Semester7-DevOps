import os
from enum import Enum
from typing import cast

class EnvironmentVariables(str, Enum):
  FaceServiceApiSecret = "FACE_SERVICE_API_SECRET"
  ApiServerUrl = "API_SERVER_URL"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
  
class FilePaths:
  TemporaryWorkingDirectory = 'tempwd',
  Queue = "queue"