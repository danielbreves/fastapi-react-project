# tests/test_tasks_api.py

from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal

# Override the database dependency to use a test database
app.dependency_overrides[SessionLocal] = lambda: SessionLocalTest()


class SessionLocalTest:
    def __init__(self):
        self.session = SessionLocal()

    def __enter__(self):
        return self.session

    def __exit__(self, exc_type, exc_value, traceback):
        self.session.rollback()
        self.session.close()


def test_create_task():
    client = TestClient(app)

    task_data = {
        "title": "Test Task",
        "description": "This is a test task.",
        "date": "2023-07-31",
        "assignee": "John Doe",
        "status": "Pending",
        "priority": "High",
    }

    response = client.post("/api/v1/tasks", json=task_data)

    assert response.status_code == 201
    assert response.json()["title"] == task_data["title"]


def test_read_task():
    client = TestClient(app)

    # Create a test task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task.",
        "date": "2023-07-31",
        "assignee": "John Doe",
        "status": "Pending",
        "priority": "High",
    }

    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Read the task
    response = client.get(f"/api/v1/tasks/{task_id}")

    assert response.status_code == 200
    assert response.json()["title"] == task_data["title"]


def test_update_task():
    client = TestClient(app)

    # Create a test task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task.",
        "date": "2023-07-31",
        "assignee": "John Doe",
        "status": "Pending",
        "priority": "High",
    }

    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Update the task
    updated_data = {
        "title": "Updated Task Title",
        "status": "In Progress",
    }

    response = client.put(f"/api/v1/tasks/{task_id}", json=updated_data)

    print(
        f"Response - Status Code: {response.status_code}, Headers: {response.headers}, Content: {response.content}")

    assert response.status_code == 200
    assert response.json()["title"] == updated_data["title"]
    assert response.json()["status"] == updated_data["status"]


def test_delete_task():
    client = TestClient(app)

    # Create a test task
    task_data = {
        "title": "Test Task",
        "description": "This is a test task.",
        "date": "2023-07-31",
        "assignee": "John Doe",
        "status": "Pending",
        "priority": "High",
    }

    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}")

    print(
        f"Response - Status Code: {response.status_code}, Headers: {response.headers}, Content: {response.content}")

    assert response.status_code == 200
    assert response.json()["id"] == task_id
