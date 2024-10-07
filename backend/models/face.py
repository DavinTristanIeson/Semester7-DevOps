import pydantic
from sqlalchemy import Float, ForeignKey, Integer
from models.album import AlbumFileModel
from models.sql import SQLBaseModel
from sqlalchemy.orm import Mapped, mapped_column

class RecognizedFaceModel(SQLBaseModel):
  __name__ = "recognized_faces"
  id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
  file_id: Mapped[int] = mapped_column(ForeignKey(AlbumFileModel.id, ondelete="CASCADE", onupdate="CASCADE"), nullable=False)

  x0: Mapped[int] = mapped_column(Integer, nullable=False)
  x1: Mapped[int] = mapped_column(Integer, nullable=False)
  y0: Mapped[int] = mapped_column(Integer, nullable=False)
  y1: Mapped[int] = mapped_column(Integer, nullable=False)
  width: Mapped[int] = mapped_column(Integer, nullable=False)
  height: Mapped[int] = mapped_column(Integer, nullable=False)
  
  happiness: Mapped[float] = mapped_column(Float, nullable=False)
  anger: Mapped[float] = mapped_column(Float, nullable=False)
  surprise: Mapped[float] = mapped_column(Float, nullable=False)
  fear: Mapped[float] = mapped_column(Float, nullable=False)
  disgust: Mapped[float] = mapped_column(Float, nullable=False)
  sadness: Mapped[float] = mapped_column(Float, nullable=False)
  neutral: Mapped[float] = mapped_column(Float, nullable=False)

class RecognizedFaceResource(pydantic.BaseModel):
  id: str

  x0: int
  x1: int 
  y0: int 
  y1: int
  width: int
  height: int

  happiness: float
  anger: float
  surprise: float
  fear: float
  disgust: float
  sadness: float
  neutral: float
