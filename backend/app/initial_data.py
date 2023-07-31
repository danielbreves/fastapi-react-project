#!/usr/bin/env python3

from app.db.user_crud import create_user, get_user_by_email
from app.db.user_schemas import UserCreate
from app.db.session import SessionLocal


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


if __name__ == "__main__":
    init()
