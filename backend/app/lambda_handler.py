from mangum import Mangum
from app import fastapi_app

handler = Mangum(fastapi_app.app, lifespan="off")
