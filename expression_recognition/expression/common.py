from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.executors.pool import ProcessPoolExecutor, ThreadPoolExecutor
scheduler = AsyncIOScheduler(
  executors=dict(
    processpool=ProcessPoolExecutor(4),
    default=ThreadPoolExecutor(20),
  ),
)
