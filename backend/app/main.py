from fastapi.middleware.cors import CORSMiddleware
from app import celery_tasks
from app.core.celery_app import celery_app
from app.domains.auth.auth import get_current_active_user
from app.db.session import SessionLocal
from app.core import config
from app.domains.tasks.api.api_v1.routers.tasks import tasks_router
from app.domains.auth.api.api_v1.routers.auth import auth_router
from app.domains.users.api.api_v1.routers.users import users_router
from fastapi import FastAPI, Depends
from starlette.requests import Request
import uvicorn
import sys
import debugpy


app = FastAPI(
    title=config.PROJECT_NAME, docs_url="/api/docs", openapi_url="/api"
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = await call_next(request)
    request.state.db.close()
    return response


@app.get("/api/v1")
async def root():
    return {"message": "Hello World"}


@app.get("/api/v1/background_task")
async def example_background_task():
    celery_app.send_task("app.tasks.example_task", args=["Hello World"])

    return {"message": "success"}


# Routers
app.include_router(
    users_router,
    prefix="/api/v1",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)
app.include_router(auth_router, prefix="/api", tags=["auth"])

app.include_router(
    tasks_router,
    prefix="/api/v1",
    tags=["tasks"],
)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--debug":
        # Enable debugging and wait for the debugger to attach
        debugpy.listen(("0.0.0.0", 5678))
        print("Waiting for debugger to attach...")
        debugpy.wait_for_client()
        print("Debugger attached.")

    # Run the Uvicorn server without debugging
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8888)
