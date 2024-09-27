import os
from enum import Enum
from typing import cast


class EnvironmentVariables(Enum, str):
  SessionSecret = "SESSION_SECRET"

  @staticmethod
  def get(env: "EnvironmentVariables")->str:
    return cast(str, os.getenv(env))