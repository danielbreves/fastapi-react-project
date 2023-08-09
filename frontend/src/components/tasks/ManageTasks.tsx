import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import SlideOver from "../shared/SlideOver";
import { Task } from "../../types/Task";
import ConfirmDeleteModal from "../shared/ConfirmDelete";
import TasksTable from "./TasksTable";
import { deleteTask, getTasks } from "../../apis/tasks.api";
import ErrorToast from "../shared/ErrorToast";
import { getProjectTasks } from "../../apis/projects.api";
import Loading from "../shared/Loading";

export default function ManageTasks({ projectId }: { projectId: number }) {
  const [tasks, setData] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestsInProgress, setRequestsInProgress] = useState<
    Promise<Response>[]
  >([]);

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

    const currentReq = deleteTask(taskToDeleteId);
    resetDeleteTask();

    try {
      setRequestsInProgress((prev) => [...prev, currentReq]);

      const response = await currentReq;

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
      setRequestsInProgress((prevReqs) =>
        prevReqs.filter((prev) => prev !== currentReq)
      );
    }
  }

  function fetchTasks() {
    const controller = new AbortController();

    (async () => {
      const currentReq = getProjectTasks(projectId, controller.signal);
      try {
        setRequestsInProgress((prev) => [...prev, currentReq]);

        const response = await currentReq;

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setData(await response.json());
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErrorMessage(error.message);
        } else {
          console.error("Error fetching tasks:", error);
        }
      } finally {
        setRequestsInProgress((prevReqs) =>
          prevReqs.filter((prev) => prev !== currentReq)
        );
      }
    })();

    return () => controller.abort();
  }

  useEffect(fetchTasks, [projectId]);

  return (
    <>
      <Button variant="outlined" onClick={() => setShowTaskForm(true)}>
        Add new
      </Button>
      {!!requestsInProgress.length && <Loading />}
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
