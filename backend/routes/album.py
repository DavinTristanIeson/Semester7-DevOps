
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from models.album import AlbumSchema
from models.api import ApiResult


router = APIRouter()

@router.post('/album', response_model=ApiResult, status_code=201)
def post__create_album(body: AlbumSchema):
    created_album = AlbumSchema(name=body.name)
    
    return JSONResponse(
        content=ApiResult(message="Created album successfully", data = created_album.model_dump()).model_dump(),
        status_code=201
    )
    
