import os
from enum import Enum
from typing import cast

class EnvironmentVariables(str, Enum):
  ApiKey = "API_KEY"
  FileAccessTokenSecret = "FILE_ACCESS_TOKEN_SECRET"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
  
class FilePaths:
  UserFiles = 'user_files'