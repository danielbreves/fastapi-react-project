import { PartialTask } from "../types/Task";

export function createTask(task: PartialTask, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/tasks`, {
    method: "POST",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export function updateTask(
  taskId: number,
  task: PartialTask,
  signal?: AbortSignal
) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/tasks/${taskId}`, {
    method: "PUT",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
}

export function deleteTask(taskId: number, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    signal: signal,
  });
}

export function getTasks(signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/tasks`, {
    signal: signal,
  });
}
