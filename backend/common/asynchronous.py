from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio

from common.metaclass import Singleton


class TaskTracker(metaclass=Singleton):
  tasks: set[asyncio.Task]
  def enqueue(self, coroutine)->asyncio.Task:
    task = asyncio.create_task(coroutine)
    self.tasks.add(task)
    task.add_done_callback(self.tasks.remove)

    return task

scheduler = AsyncIOScheduler()

__all__ = [
  "scheduler",
  "TaskTracker"
]