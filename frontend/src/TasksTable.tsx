import "bootstrap/dist/css/bootstrap.css";
import { Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import AddNewForm from "./AddNewForm";
import SlideOver from "./SlideOver";

interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  assignee: string;
  status: string;
  priority: string;
}

export default function TasksTable() {
  const [tasksData, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showAddNew, setShowAddNew] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  function handleAddTask() {
    fetchTasks();
    setShowAddNew(false);
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
      <Button variant="primary" onClick={() => setShowAddNew(true)}>
        Add new
      </Button>
      <SlideOver
        show={showAddNew}
        onHide={() => setShowAddNew(false)}
        title="Add new"
      >
        <AddNewForm onAddTask={handleAddTask} />
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
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

