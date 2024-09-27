import pydantic

# Resource
class UserResource(pydantic.BaseModel):
  id: str
  email: str

class SessionTokenResource(pydantic.BaseModel):
  access_token: str
  refresh_token: str


# Schema
class RefreshTokenSchema(pydantic.BaseModel):
  refresh_token: str

class UserMutationSchema(pydantic.BaseModel):
  email: str
  password: str
