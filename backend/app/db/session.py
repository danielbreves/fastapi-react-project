import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from app.core.config import load_secret

Base = declarative_base()

_session_local: None | Session = None


def get_session_local():
    global _session_local

    if _session_local is not None:
        return _session_local()

    db_secret_name = os.environ.get("DB_SECRET_ARN")
    db_secret = load_secret(db_secret_name)
    db_endpoint = os.environ.get("DB_ENDPOINT")
    db_name = os.environ.get("DB_NAME")
    db_url = f"postgresql://{db_secret['username']}:{db_secret['password']}@{db_endpoint}/{db_name}"

    engine = create_engine(db_url)

    _session_local = sessionmaker(
        autocommit=False, autoflush=False, bind=engine)

    return _session_local()


# Dependency
def get_db():
    db = get_session_local()
    try:
        yield db
    finally:
        db.close()
