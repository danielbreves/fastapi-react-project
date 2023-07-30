from sqlalchemy.orm import Session
from . import task_model, task_schemas


def get_task(db: Session, task_id: int):
    return db.query(task_model.Task).filter(task_model.Task.id == task_id).first()


def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(task_model.Task).offset(skip).limit(limit).all()


def create_task(db: Session, task: task_schemas.TaskCreate):
    db_task = task_model.Task(**task.dict(exclude_unset=True))
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: task_schemas.TaskUpdate):
    db_task = db.query(task_model.Task).filter(
        task_model.Task.id == task_id).first()
    for key, value in task.dict(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = db.query(task_model.Task).filter(
        task_model.Task.id == task_id).first()
    db.delete(db_task)
    db.commit()
    return db_task
