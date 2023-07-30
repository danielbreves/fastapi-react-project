from app import celery_tasks


def test_example_task():
    task_output = celery_tasks.example_task("Hello World")
    assert task_output == "test task returns Hello World"
