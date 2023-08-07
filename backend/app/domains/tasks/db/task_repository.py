from app.domains.tasks.db import task_dtos
from sqlalchemy.orm import Session
from . import task_entity


def get_task(db: Session, task_id: int):
    return db.query(task_entity.Task).filter(task_entity.Task.id == task_id).first()


def get_task_by_title(db: Session, title: str) -> task_dtos.TaskBase:
    return db.query(task_entity.Task).filter(task_entity.Task.title == title).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(task_entity.Task).order_by(task_entity.Task.created_at.desc()).offset(skip).limit(limit).all()


def create_task(db: Session, task: task_dtos.TaskCreate):
    db_task = task_entity.Task(**task.dict(exclude_unset=True))
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: task_dtos.TaskUpdate):
    db_task = db.query(task_entity.Task).filter(
        task_entity.Task.id == task_id).first()
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = db.query(task_entity.Task).filter(
        task_entity.Task.id == task_id).first()
    db.delete(db_task)
    db.commit()
    return db_task
