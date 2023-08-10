import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import TaskForm from "../components/tasks/TaskForm";
import SlideOver from "../components/shared/SlideOver";
import { Task } from "../types/Task";
import ConfirmDeleteModal from "../components/shared/ConfirmDelete";
import TasksTable from "../components/tasks/TasksTable";
import { deleteTask } from "../apis/tasks.api";
import ErrorToast from "../components/shared/ErrorToast";
import { getProjectTasks } from "../apis/projects.api";
import Loading from "../components/shared/Loading";
import { useParams } from "react-router-dom";

interface ManageTasksParams extends Record<string, string | undefined> {
  projectId: string;
}

export default function ManageTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestsInProgress, setRequestsInProgress] = useState<
    Promise<Response>[]
  >([]);
  const params = useParams<ManageTasksParams>();
  const projectId = Number(params.projectId);

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
    setTaskIdToDelete(taskId);
    setShowDeleteModal(true);
  }

  function resetDeleteTask() {
    setTaskIdToDelete(null);
    setShowDeleteModal(false);
  }

  function doDeleteTask() {
    if (!taskIdToDelete) {
      return;
    }

    const currentReq = deleteTask(taskIdToDelete);
    resetDeleteTask();

    (async () => {
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
    })();
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

        setTasks(await response.json());
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
