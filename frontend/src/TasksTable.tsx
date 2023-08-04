import "bootstrap/dist/css/bootstrap.css";
import { Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import SlideOver from "./SlideOver";
import {Task} from "./types/Task";

export default function TasksTable() {
  const [tasksData, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  function handleSaveTask() {
    fetchTasks();
    closeTaskForm();
  }

  function closeTaskForm() {
    setShowTaskForm(false);
    setEditingTaskId(null);
  }

  function handleUpdateTask(taskId: number) {
    setEditingTaskId(taskId);
    setShowTaskForm(true);
  }

  function fetchTasks() {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/v1/tasks", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setError(null);
        setData(await response.json());
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          console.log(error);
        }
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }

  useEffect(fetchTasks, []);

  return (
    <>
      <Button variant="primary" onClick={() => setShowTaskForm(true)}>
        Add new
      </Button>
      <SlideOver
        show={showTaskForm}
        onHide={() => setShowTaskForm(false)}
        title="Add new"
      >
        <TaskForm
          onSaveTask={handleSaveTask}
          initialTask={
            editingTaskId
              ? tasksData.find((task) => task.id === editingTaskId)
              : undefined
          }
        />
      </SlideOver>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Date</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasksData.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.date}</td>
              <td>{task.assignee}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() => handleUpdateTask(task.id!)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
