import sqlalchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase
class SQLBaseModel(DeclarativeBase):
  pass

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-sqlalchemy-engine
engine = sqlalchemy.create_engine('sqlite:///database.db', connect_args={"check_same_thread": False})
SQLSession = sessionmaker(engine, autocommit=False, autoflush=False)

__all__ = [
  "SQLBaseModel",
  "engine",
  "SQLSession"
]