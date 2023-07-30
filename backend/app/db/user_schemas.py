from pydantic import BaseModel
from datetime import datetime
import typing as t


class UserBase(BaseModel):
    is_active: bool = True
    is_superuser: bool = False
    first_name: t.Union[str, None] = None
    last_name: t.Union[str, None] = None


class UserOut(UserBase):
    pass


class UserCreate(UserBase):
    email: str
    password: str

    class Config:
        orm_mode = True


class UserEdit(UserBase):
    email: t.Optional[str] = None
    password: t.Optional[str] = None

    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: t.Union[str, None] = None
    permissions: str = "user"
