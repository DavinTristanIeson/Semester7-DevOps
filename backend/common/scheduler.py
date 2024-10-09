from rocketry import Rocketry
import asyncio

from common.metaclass import Singleton

scheduler = Rocketry()

class TaskTracker(metaclass=Singleton):
  tasks: set[asyncio.Task]
  def enqueue(self, coroutine: asyncio._CoroutineLike)->asyncio.Task:
    task = asyncio.create_task(coroutine)
    self.tasks.add(task)
    task.add_done_callback(self.tasks.remove)

    return task

__all__ = [
  "scheduler",
  "TaskTracker"
]