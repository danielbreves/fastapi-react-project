from pydantic import BaseModel, ConfigDict
import datetime
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

    description: str | None = None
    due_date: datetime.date | None = None
    assignee: str | None = None
    status: Status | None = None
    priority: Priority | None = None
    project_id: int | None = None


class TaskCreate(TaskBase):
    title: str


class TaskUpdate(TaskBase):
    title: str | None = None


class Task(TaskBase):
    id: int
    title: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
