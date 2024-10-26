from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.executors.pool import ProcessPoolExecutor, ThreadPoolExecutor
scheduler = BlockingScheduler(
  executors=dict(
    processpool=ProcessPoolExecutor(4),
    default=ThreadPoolExecutor(1),
  ),
)
