from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db import task_crud, task_schemas

tasks_router = r = APIRouter()


# Route to get a task by its ID
@r.get("/tasks/{task_id}", response_model=task_schemas.Task)
async def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# Route to get a list of tasks with optional pagination
@r.get("/tasks", response_model=List[task_schemas.Task])
async def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return task_crud.get_tasks(db, skip=skip, limit=limit)


# Route to create a new task
@r.post("/tasks", response_model=task_schemas.Task, status_code=201)
async def create_task(task: task_schemas.TaskCreate, db: Session = Depends(get_db)):
    return task_crud.create_task(db, task)


# Route to update an existing task
@r.put("/tasks/{task_id}", response_model=task_schemas.Task)
async def update_task(task_id: int, task: task_schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = task_crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_crud.update_task(db, task_id, task)


# Route to delete a task
@r.delete("/tasks/{task_id}", response_model=task_schemas.Task)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_crud.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_crud.delete_task(db, task_id)
