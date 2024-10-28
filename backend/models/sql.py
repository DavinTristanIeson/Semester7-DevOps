from typing import Annotated
import uuid
from fastapi import Depends
import sqlalchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase, mapped_column, Session

from common.constants import EnvironmentVariables
class SQLBaseModel(DeclarativeBase):
  pass

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-sqlalchemy-engine
if EnvironmentVariables.get(EnvironmentVariables.Environment) == 'dev':
  def _fk_pragma_on_connect(dbapi_con, con_record):
    # https://stackoverflow.com/questions/2614984/sqlite-sqlalchemy-how-to-enforce-foreign-keys
    dbapi_con.execute('pragma foreign_keys=ON')
  engine = sqlalchemy.create_engine('sqlite:///database.db', connect_args={"check_same_thread": False})

  sqlalchemy.event.listen(engine, 'connect', _fk_pragma_on_connect)
else:
  postgres_user = EnvironmentVariables.get(EnvironmentVariables.PostgresUser)
  postgres_password = EnvironmentVariables.get(EnvironmentVariables.PostgresPassword)
  postgres_host = EnvironmentVariables.get(EnvironmentVariables.PostgresHost)
  postgres_db = EnvironmentVariables.get(EnvironmentVariables.PostgresDB)
  postgres_url = f"postgresql+psycopg2://{postgres_user}:{postgres_password}@{postgres_host}/{postgres_db}"
  engine = sqlalchemy.create_engine(postgres_url)
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