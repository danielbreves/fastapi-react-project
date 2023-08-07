from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.domains.tasks.db import task_repository, task_dtos

tasks_router = r = APIRouter()


# Route to get a task by its ID
@r.get("/tasks/{task_id}", response_model=task_dtos.Task)
async def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_repository.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


# Route to get a list of tasks with optional pagination
@r.get("/tasks", response_model=List[task_dtos.Task])
async def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return task_repository.get_tasks(db, skip=skip, limit=limit)


# Route to create a new task
@r.post("/tasks", response_model=task_dtos.Task, status_code=201)
async def create_task(task: task_dtos.TaskCreate, db: Session = Depends(get_db)):
    return task_repository.create_task(db, task)


# Route to update an existing task
@r.put("/tasks/{task_id}", response_model=task_dtos.Task)
async def update_task(task_id: int, task: task_dtos.TaskUpdate, db: Session = Depends(get_db)):
    db_task = task_repository.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_repository.update_task(db, task_id, task)


# Route to delete a task
@r.delete("/tasks/{task_id}", response_model=task_dtos.Task)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = task_repository.get_task(db, task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_repository.delete_task(db, task_id)
