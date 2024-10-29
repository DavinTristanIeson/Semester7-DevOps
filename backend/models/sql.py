from typing import Annotated
import uuid
from fastapi import Depends
import sqlalchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase, mapped_column, Session
class SQLBaseModel(DeclarativeBase):
  pass

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-sqlalchemy-engine
engine = sqlalchemy.create_engine('postgresql://Parallel:secret\@127.0.0.1:5432/parallel', connect_args={"check_same_thread": False})
SQLSession = sessionmaker(engine, autocommit=False, autoflush=False)

def UUID_column():
  return mapped_column(sqlalchemy.String(36), unique=True, default=lambda: uuid.uuid4().hex, nullable=False)

def get_db():
  return SQLSession()

SQLSessionDependency = Annotated[Session, Depends(get_db)]

__all__ = [
  "SQLBaseModel",
  "engine",
  "SQLSession",
  "UUID_column",
  "SQLSessionDependency",
]