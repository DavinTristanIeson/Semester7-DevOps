import dotenv
dotenv.load_dotenv()

from expression.scheduling import scheduler

# Run in a separate process
if __name__ == "__main__":
  scheduler.start()