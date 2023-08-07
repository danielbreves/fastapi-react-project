from pydantic import BaseModel
import datetime
from typing import Optional


class ProjectBase(BaseModel):
    description: Optional[str] = None
    due_date: Optional[datetime.date] = None
    assignee: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None

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
