import os
from enum import Enum
from typing import cast


class EnvironmentVariables(Enum):
  AccessTokenSecret = "ACCESS_TOKEN_SECRET"
  RefreshTokenSecret = "REFRESH_TOKEN_SECRET"
  ExpressionRecognitionApiUrl = "EXPRESSION_RECOGNITION_API_URL"
  ExpressionRecognitionApiSecret = "EXPRESSION_RECOGNITION_API_SECRET"
  Docker = "DOCKER"
  PostgresUser = "POSTGRES_USER"
  PostgresPassword = "POSTGRES_PASSWORD"
  PostgresDB = "POSTGRES_DB"
  PostgresHost = "POSTGRES_HOST"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env.value))
