from sqlalchemy import Column, Integer, String, Text, Date, DateTime, func

from app.db.session import Base


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    date = Column(Date, nullable=True)
    assignee = Column(String(100), nullable=True)
    status = Column(String(20), nullable=True)
    priority = Column(String(20), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(),
                        onupdate=func.now(), nullable=False)
