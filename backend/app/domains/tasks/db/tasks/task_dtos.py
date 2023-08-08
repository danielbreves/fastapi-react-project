from pydantic import BaseModel, ConfigDict
import datetime
from typing import Optional
from enum import Enum


class Status(Enum):
    TO_DO = 'to_do'
    IN_PROGRESS = 'in_progress'
    DONE = 'done'

    def __str__(self):
        return self.value


class Priority(Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

    def __str__(self):
        return self.value


class TaskBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    description: Optional[str] = None
    due_date: Optional[datetime.date] = None
    assignee: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None


class TaskCreate(TaskBase):
    title: str


class TaskUpdate(TaskBase):
    title: Optional[str] = None


class Task(TaskBase):
    id: int
    title: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
