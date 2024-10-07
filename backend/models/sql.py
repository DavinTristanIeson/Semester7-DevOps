import uuid
import sqlalchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase, mapped_column
class SQLBaseModel(DeclarativeBase):
  pass

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-sqlalchemy-engine
engine = sqlalchemy.create_engine('sqlite:///database.db', connect_args={"check_same_thread": False})
SQLSession = sessionmaker(engine, autocommit=False, autoflush=False)

def UUID_column():
  return mapped_column(sqlalchemy.String(36), unique=True, default=lambda: uuid.uuid4().hex, nullable=False)

__all__ = [
  "SQLBaseModel",
  "engine",
  "SQLSession",
  "UUID_column"
]