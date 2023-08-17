import os
from dotenv import load_dotenv
import json
import botocore
import botocore.session
from aws_secretsmanager_caching import SecretCache, SecretCacheConfig

load_dotenv()

PROJECT_NAME = "fastapi-react-project"

AWS_REGION: str = os.environ.get("AWS_REGION")
TEST_USERNAME: str = os.environ.get("TEST_USERNAME")
TEST_PASSWORD: str = os.environ.get("TEST_PASSWORD")
CORS_ORIGINS: str = os.environ.get("CORS_ORIGINS")

API_V1_STR = "/api/v1"

_client = botocore.session.get_session().create_client(
    'secretsmanager', region_name=AWS_REGION)
_cache_config = SecretCacheConfig()
_cache = SecretCache(config=_cache_config, client=_client)


def load_secret(secret_name):
    try:
        secret = _cache.get_secret_string(secret_name)
        return json.loads(secret)
    except Exception as e:
        print(e)
        raise e
