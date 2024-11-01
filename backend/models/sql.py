import time
import logging
from typing import Annotated, Optional
import uuid
from fastapi import Depends
import sqlalchemy
from sqlalchemy.orm import sessionmaker, DeclarativeBase, mapped_column, Session

from common.constants import EnvironmentVariables
class SQLBaseModel(DeclarativeBase):
  pass

# https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-sqlalchemy-engine
if not EnvironmentVariables.get(EnvironmentVariables.Docker):
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
  
  psql_engine: Optional[sqlalchemy.engine.Engine] = None
  for i in range(3):
    try:
      psql_engine = sqlalchemy.create_engine(postgres_url)
      with psql_engine.connect() as connection:
        # https://stackoverflow.com/questions/50927740/sqlalchemy-create-schema-if-not-exists
        connection.execute(sqlalchemy.schema.CreateSchema(postgres_db, if_not_exists=True))
        connection.commit()
      break
    except Exception as e:
      print(f"Failed to initialize SQL engine. Error => {e}. Retrying in 5s...")
      time.sleep(5)

  if psql_engine is None:
    exit(1)
  engine = psql_engine

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