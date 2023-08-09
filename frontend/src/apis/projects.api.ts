import { PartialProject } from "../types/Project";

export function getProjectTasks(projectId: number, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects/${projectId}/tasks`, {
    signal: signal,
  });
}

export function createProject(project: PartialProject, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects`, {
    method: "POST",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export function updateProject(
  projectId: number,
  project: PartialProject,
  signal?: AbortSignal
) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects/${projectId}`, {
    method: "PUT",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });
}

export function deleteProject(projectId: number, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects/${projectId}`, {
    method: "DELETE",
    signal: signal,
  });
}

export function getProjects(signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects`, {
    signal: signal,
  });
}