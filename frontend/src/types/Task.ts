export interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  assignee: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface PartialTask {
    id?: number;
    title: string;
    description?: string;
    date?: string;
    assignee?: string;
    status?: string;
    priority?: string;
  }