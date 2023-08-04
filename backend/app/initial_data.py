#!/usr/bin/env python3

from app.db.user_crud import create_user, get_user_by_email
from app.db.user_schemas import UserCreate
from app.db.task_crud import create_task, get_task_by_title
from app.db.task_schemas import TaskCreate
from app.db.session import SessionLocal
from datetime import date

tasks = [
    TaskCreate(
        title="Complete project proposal",
        description="Write a detailed proposal for the new project.",
        date=date(2023, 8, 15),
        assignee="John Doe",
        status="In Progress",
        priority="High",
    ),
    TaskCreate(
        title="Review and provide feedback",
        description="Review the marketing plan and provide feedback.",
        date=date(2023, 8, 20),
        assignee="Jane Smith",
        status="Pending",
        priority="Medium",
    ),
    TaskCreate(
        title="Bug fixing",
        description="Fix the critical bug in the application.",
        date=date(2023, 8, 10),
        assignee="Alex Johnson",
        status="Completed",
        priority="High",
    ),
    TaskCreate(
        title="Implement new feature",
        description="Add the ability to upload images in the profile section.",
        date=date(2023, 8, 25),
        assignee="Sarah Brown",
        status="Planned",
        priority="Low",
    ),
    TaskCreate(
        title="Optimize database queries",
        description="Identify and optimize slow database queries.",
        date=date(2023, 8, 12),
        assignee="James Wilson",
        status="In Progress",
        priority="High",
    ),
]


def init() -> None:
    db = SessionLocal()

    admin_email = ""
    user = get_user_by_email(db, admin_email)

    if not user:
        print("Creating superuser")
        create_user(
            db,
            UserCreate(
                email="",
                password="",
                is_active=True,
                is_superuser=True,
            ),
        )
        print("Superuser created")

    for task in tasks:
        if not get_task_by_title(db, task.title):
            create_task(db, task)


if __name__ == "__main__":
    init()
