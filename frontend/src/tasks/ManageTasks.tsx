import "bootstrap/dist/css/bootstrap.css";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import SlideOver from "../shared/SlideOver";
import { Task } from "../types/Task";
import ConfirmDeleteModal from "../shared/ConfirmDelete";
import TasksTable from "./TasksTable";
import { deleteTask, getTasks } from "./tasks.api";

export default function ManageTasks() {
  const [tasks, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);

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

  function handleDeleteTask(taskId: number) {
    setTaskToDeleteId(taskId);
    setShowDeleteModal(true);
  }

  function resetDeleteTask() {
    setTaskToDeleteId(null);
    setShowDeleteModal(false);
  }

  async function doDeleteTask() {
    if (!taskToDeleteId) {
      return;
    }

    resetDeleteTask();

    try {
      const response = await deleteTask(taskToDeleteId);

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function fetchTasks() {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const response = await getTasks(controller.signal);

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
      <SlideOver show={showTaskForm} onHide={closeTaskForm} title="Add new">
        <TaskForm
          onSaveTask={handleSaveTask}
          initialTask={
            editingTaskId
              ? tasks.find((task) => task.id === editingTaskId)
              : undefined
          }
        />
      </SlideOver>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      <TasksTable
        tasks={tasks}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
      <ConfirmDeleteModal
        showDeleteModal={showDeleteModal}
        handleDelete={doDeleteTask}
        handleCancel={resetDeleteTask}
      />
    </>
  );
}
