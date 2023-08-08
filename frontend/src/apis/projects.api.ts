export function getProjectTasks(projectId: number, signal?: AbortSignal) {
  return fetch(`${process.env.REACT_APP_BASE_API_URL}/projects/${projectId}/tasks`, {
    signal: signal,
  });
}
