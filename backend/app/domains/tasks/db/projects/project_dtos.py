from enum import Enum
from pydantic import BaseModel
import datetime
from typing import Optional


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
    description: Optional[str] = None
    due_date: Optional[datetime.date] = None
    assignee: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None

    class Config:
        orm_mode = True


class ProjectCreate(ProjectBase):
    title: str


class ProjectUpdate(ProjectBase):
    title: Optional[str] = None


class Project(ProjectBase):
    id: int
    title: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
