import os
from enum import Enum
from typing import cast


class EnvironmentVariables(str, Enum):
  AccessTokenSecret = "ACCESS_TOKEN_SECRET"
  RefreshTokenSecret = "REFRESH_TOKEN_SECRET"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
  
class FilePaths:
  UserFiles = 'user_files'