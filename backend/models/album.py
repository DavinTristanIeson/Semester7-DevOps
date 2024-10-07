import datetime

import pydantic

from models.sql import SQLBaseModel

from typing import List, Optional

class AlbumModel(SQLBaseModel):
    id: int
    name: str
    created_at: datetime.datetime = datetime.datetime.now()

    @classmethod
    def create(cls, name: str):
        new_album: cls(name=name)
        return new_album
    
    @classmethod
    def get_all(cls) -> List['AlbumModel']:
        albums = [cls(name="Album 1"), cls(name="Album 2")]
        return albums
    
class ALbumResource:
    name: str
    created_at: datetime.datetime

class AlbumSchema(pydantic.BaseModel):
    name: str
    created_at: Optional[datetime.datetime] = None
    
    class Config:
        orm_mode = True
        
        
new_album = AlbumModel.create(name='New Album')
print('Album Created :',new_album.name)

albums = AlbumModel.get_all()
for album in albums:
    print('Album :', album.name, 'Created at :', album.created_at)