import os
from dotenv import load_dotenv
from sqlalchemy import URL

load_dotenv()

PROJECT_NAME = "fastapi-react-project"

DATABASE_URL: URL = os.getenv("DATABASE_URL")
SECRET_KEY: str = os.getenv("SECRET_KEY")
TEST_USERNAME: str = os.getenv("TEST_USERNAME")
TEST_PASSWORD: str = os.getenv("TEST_PASSWORD")
CORS_ORIGINS: str = os.getenv("CORS_ORIGINS")


API_V1_STR = "/api/v1"
