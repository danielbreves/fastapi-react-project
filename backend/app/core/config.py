import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_NAME = "fastapi-react-project"

DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
TEST_USERNAME = os.getenv("TEST_USERNAME")
TEST_PASSWORD = os.getenv("TEST_PASSWORD")


API_V1_STR = "/api/v1"
