#!/usr/bin/env python3

from app.domains.users.db.user_repository import create_user, get_user_by_email
from app.domains.users.db.user_dtos import UserCreate
from app.domains.tasks.db.tasks.task_repository import create_task, get_task_by_title
from app.domains.tasks.db.tasks.task_dtos import TaskCreate
from app.domains.tasks.db.projects.project_repository import create_project, get_project_by_title
from app.domains.tasks.db.projects.project_dtos import ProjectCreate
from app.db.session import SessionLocal
from datetime import date
from app.core import config

projects = [
    ProjectCreate(
        title="Project Mars Landing",
        description="Land on Mars by the end of the decade.",
        due_date=date(2030, 12, 31),
        assignee="John Doe",
        status="Not started",
        priority="Medium",
    ),
    ProjectCreate(
        title="Net Zero by 2050",
        description="Achieve net zero carbon emissions by 2050.",
        due_date=date(2050, 12, 31),
        assignee="Jane Smith",
        status="Not started",
        priority="High",
    ),
]

tasks = [
    TaskCreate(
        title="Complete project proposal",
        description="Write a detailed proposal for the new project.",
        due_date=date(2023, 8, 15),
        assignee="John Doe",
        status="In Progress",
        priority="High",
    ),
    TaskCreate(
        title="Review and provide feedback",
        description="Review the marketing plan and provide feedback.",
        due_date=date(2023, 8, 20),
        assignee="Jane Smith",
        status="Pending",
        priority="Medium",
    ),
    TaskCreate(
        title="Bug fixing",
        description="Fix the critical bug in the application.",
        due_date=date(2023, 8, 10),
        assignee="Alex Johnson",
        status="Completed",
        priority="High",
    ),
    TaskCreate(
        title="Implement new feature",
        description="Add the ability to upload images in the profile section.",
        due_date=date(2023, 8, 25),
        assignee="Sarah Brown",
        status="Planned",
        priority="Low",
    ),
    TaskCreate(
        title="Optimize database queries",
        description="Identify and optimize slow database queries.",
        due_date=date(2023, 8, 12),
        assignee="James Wilson",
        status="In Progress",
        priority="High",
    ),
]


def init() -> None:
    db = SessionLocal()

    admin_email = config.TEST_USERNAME
    admin_password = config.TEST_PASSWORD
    user = get_user_by_email(db, admin_email)

    if not user:
        print("Creating test superuser")
        create_user(
            db,
            UserCreate(
                email=admin_email,
                password=admin_password,
                is_active=True,
                is_superuser=True,
            ),
        )
        print("Superuser created")

    for task in tasks:
        if not get_task_by_title(db, task.title):
            create_task(db, task)

    for project in projects:
        if not get_project_by_title(db, project.title):
            create_project(db, project)


if __name__ == "__main__":
    init()
