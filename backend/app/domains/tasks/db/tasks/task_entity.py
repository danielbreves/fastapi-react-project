from sqlalchemy import Column, ForeignKey, Integer, String, Enum, Text, Date, DateTime, func
from app.db.session import Base
from app.domains.tasks.db.tasks.task_dtos import Status, Priority


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=True)
    assignee = Column(String(100), nullable=True)
    status = Column(Enum(Status), nullable=True)
    priority = Column(Enum(Priority), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now(), nullable=False)
