import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import SlideOver from "../shared/SlideOver";
import { Task } from "../../types/Task";
import ConfirmDeleteModal from "../shared/ConfirmDelete";
import TasksTable from "./TasksTable";
import { deleteTask, getTasks } from "../../apis/tasks.api";
import ErrorToast from "../shared/ErrorToast";
import LoadingSpinner from "../shared/LoadingSpinner";
import { getProjectTasks } from "../../apis/projects.api";

export default function ManageTasks({ projectId }: { projectId: number}) {
  const [tasks, setData] = useState<Task[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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

    setLoading(true);
    resetDeleteTask();

    try {
      const response = await deleteTask(taskToDeleteId);

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        console.error("Error deleting task:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  function fetchTasks() {
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const response = await getProjectTasks(projectId, controller.signal);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setData(await response.json());
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          console.error("Error fetching tasks:", error);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }

  useEffect(fetchTasks, []);

  return (
    <>
      <Button variant="outlined" onClick={() => setShowTaskForm(true)}>
        Add new
      </Button>
      <SlideOver
        show={showTaskForm}
        onHide={closeTaskForm}
        title={editingTaskId ? "Update task" : "Add new task"}
      >
        <TaskForm
          onSaveTask={handleSaveTask}
          initialTask={
            editingTaskId
              ? tasks.find((task) => task.id === editingTaskId)
              : undefined
          }
          projectId={projectId}
          onError={(message: string) => setErrorMessage(message)}
        />
      </SlideOver>
      {isLoading && <LoadingSpinner />}
      <ErrorToast
        message={errorMessage}
        handleClose={() => setErrorMessage("")}
      />
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
