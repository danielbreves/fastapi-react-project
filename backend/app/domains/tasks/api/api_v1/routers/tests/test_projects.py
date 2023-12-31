from app.domains.tasks.db.projects.project_dtos import Status, Priority

project_data = {
    "title": "Test Project",
    "description": "This is a test project.",
    "date": "2023-07-31",
    "assignee": "John Doe",
    "status": str(Status.IN_PROGRESS),
    "priority": str(Priority.HIGH),
}


def test_create_project(client):
    response = client.post("/api/v1/projects", json=project_data)

    assert response.status_code == 201
    assert response.json()["title"] == project_data["title"]


def test_read_project(client):
    response = client.post("/api/v1/projects", json=project_data)
    project_id = response.json()["id"]

    # Read the project
    response = client.get(f"/api/v1/projects/{project_id}")

    assert response.status_code == 200
    assert response.json()["title"] == project_data["title"]


def test_update_project(client):
    response = client.post("/api/v1/projects", json=project_data)
    project_id = response.json()["id"]

    # Update the project
    updated_data = {
        "title": "Updated Project Title",
        "status": str(Status.DONE),
    }

    response = client.put(f"/api/v1/projects/{project_id}", json=updated_data)

    assert response.status_code == 200
    assert response.json()["title"] == updated_data["title"]
    assert response.json()["status"] == updated_data["status"]


def test_delete_project(client):
    response = client.post("/api/v1/projects", json=project_data)
    project_id = response.json()["id"]

    # Delete the project
    response = client.delete(f"/api/v1/projects/{project_id}")

    assert response.status_code == 200
    assert response.json()["id"] == project_id
