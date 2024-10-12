import dotenv
dotenv.load_dotenv()

from expression.scheduling import scheduler
import asyncio

# Run in a separate process
if __name__ == "__main__":
  scheduler.start()