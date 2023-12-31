import jwt
from fastapi.security import OAuth2PasswordBearer
from passlib.hash import sha512_crypt
from datetime import datetime, timedelta
from app.core import config

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

SECRET_KEY = config.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_password_hash(password: str) -> str:
    return sha512_crypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return sha512_crypt.verify(plain_password, hashed_password)


def create_access_token(*, data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
