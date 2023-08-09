export enum Status {
  TO_DO = "to_do",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const statusLabels: Record<Status, string> = {
  [Status.TO_DO]: "To Do",
  [Status.IN_PROGRESS]: "In Progress",
  [Status.DONE]: "Done",
};

export const priorityLabels: Record<Priority, string> = {
  [Priority.LOW]: "Low",
  [Priority.MEDIUM]: "Medium",
  [Priority.HIGH]: "High",
};


export interface Project {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  assignee: string | null;
  status: Status | null | "";
  priority: Priority | null | "";
  created_at: string;
  updated_at: string;
}

export interface PartialProject {
    id?: number;
    title: string;
    description?: string;
    due_date?: string;
    assignee?: string;
    status?: Status | "";
    priority?: Priority | "";
  }