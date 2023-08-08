#!/usr/bin/env python3

from random import choice
from app.db.session import SessionLocal
from datetime import date
from app.core import config
from app.domains.users.db.user_repository import create_user, get_user_by_email
from app.domains.users.db.user_dtos import UserCreate
from app.domains.tasks.db.tasks.task_repository import create_task, get_task_by_title
from app.domains.tasks.db.tasks.task_dtos import Priority as TaskPriority, Status as TaskStatus, TaskCreate
from app.domains.tasks.db.projects.project_dtos import Priority as ProjectPriority, Status as ProjectStatus
from app.domains.tasks.db.projects.project_repository import create_project, get_project_by_title
from app.domains.tasks.db.projects.project_dtos import ProjectCreate

projects = [
    ProjectCreate(
        title="Project Mars Landing",
        description="Land on Mars by the end of the decade.",
        due_date=date(2030, 12, 31),
        assignee="John Doe",
        status=ProjectStatus.TO_DO,
        priority=ProjectPriority.MEDIUM,
    ),
    ProjectCreate(
        title="Net Zero by 2050",
        description="Achieve net zero carbon emissions by 2050.",
        due_date=date(2050, 12, 31),
        assignee="Jane Smith",
        status=ProjectStatus.TO_DO,
        priority=ProjectPriority.HIGH,
    ),
]

tasks = [
    TaskCreate(
        title="Complete project proposal",
        description="Write a detailed proposal for the new project.",
        due_date=date(2023, 8, 15),
        assignee="John Doe",
        status=TaskStatus.IN_PROGRESS,
        priority=TaskPriority.HIGH,
    ),
    TaskCreate(
        title="Review and provide feedback",
        description="Review the marketing plan and provide feedback.",
        due_date=date(2023, 8, 20),
        assignee="Jane Smith",
        status=TaskStatus.IN_PROGRESS,
        priority=TaskPriority.MEDIUM,
    ),
    TaskCreate(
        title="Bug fixing",
        description="Fix the critical bug in the application.",
        due_date=date(2023, 8, 10),
        assignee="Alex Johnson",
        status=TaskStatus.DONE,
        priority=TaskPriority.HIGH,
    ),
    TaskCreate(
        title="Implement new feature",
        description="Add the ability to upload images in the profile section.",
        due_date=date(2023, 8, 25),
        assignee="Sarah Brown",
        status=TaskStatus.IN_PROGRESS,
        priority=TaskPriority.LOW,
    ),
    TaskCreate(
        title="Optimize database queries",
        description="Identify and optimize slow database queries.",
        due_date=date(2023, 8, 12),
        assignee="James Wilson",
        status=TaskStatus.IN_PROGRESS,
        priority=TaskPriority.HIGH,
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

    for project in projects:
        if not get_project_by_title(db, project.title):
            create_project(db, project)

    for task in tasks:
        if not get_task_by_title(db, task.title):
            project = get_project_by_title(db, choice(projects).title)
            task.project_id = project.id
            create_task(db, task)


if __name__ == "__main__":
    init()
