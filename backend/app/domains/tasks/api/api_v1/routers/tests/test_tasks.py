from app.domains.tasks.db.tasks.task_dtos import Status, Priority

task_data = {
    "title": "Test Task",
    "description": "This is a test task.",
    "date": "2023-07-31",
    "assignee": "John Doe",
    "status": str(Status.IN_PROGRESS),
    "priority": str(Priority.HIGH),
}


def test_create_task(client):
    response = client.post("/api/v1/tasks", json=task_data)

    assert response.status_code == 201
    assert response.json()["title"] == task_data["title"]


def test_read_task(client):
    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Read the task
    response = client.get(f"/api/v1/tasks/{task_id}")

    assert response.status_code == 200
    assert response.json()["title"] == task_data["title"]


def test_update_task(client):
    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Update the task
    updated_data = {
        "title": "Updated Task Title",
        "status": str(Status.DONE),
    }

    response = client.put(f"/api/v1/tasks/{task_id}", json=updated_data)

    assert response.status_code == 200
    assert response.json()["title"] == updated_data["title"]
    assert response.json()["status"] == updated_data["status"]


def test_delete_task(client):
    response = client.post("/api/v1/tasks", json=task_data)
    task_id = response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/v1/tasks/{task_id}")

    assert response.status_code == 200
    assert response.json()["id"] == task_id
