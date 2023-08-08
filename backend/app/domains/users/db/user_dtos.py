from pydantic import BaseModel, ConfigDict
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
    model_config = ConfigDict(from_attributes=True)

    email: str
    password: str


class UserEdit(UserBase):
    model_config = ConfigDict(from_attributes=True)

    email: t.Optional[str] = None
    password: t.Optional[str] = None


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    created_at: datetime
    updated_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: t.Union[str, None] = None
    permissions: str = "user"
