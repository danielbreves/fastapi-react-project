from enum import Enum
from pydantic import BaseModel, ConfigDict
import datetime
from app.domains.tasks.db.tasks.task_dtos import Task


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


class ProjectBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    description: str | None = None
    due_date: datetime.date | None = None
    assignee: str | None = None
    status: Status | None = None
    priority: Priority | None = None


class ProjectCreate(ProjectBase):
    title: str


class ProjectUpdate(ProjectBase):
    title: str | None = None


class Project(ProjectBase):
    id: int
    title: str
    tasks: list[Task] = []
    created_at: datetime.datetime
    updated_at: datetime.datetime
