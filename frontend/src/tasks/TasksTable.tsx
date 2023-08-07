import { Table, Button, ButtonGroup } from "react-bootstrap";
import { Task, priorityLabels, statusLabels } from "../types/Task";
import { FaTrashCan, FaPencil } from "react-icons/fa6";
import { formatDate } from "../utils/utils";

interface TasksTableProps {
  tasks: Task[];
  onUpdateTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
}

export default function TasksTable({
  tasks,
  onUpdateTask,
  onDeleteTask,
}: TasksTableProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Due date</th>
          <th>Assignee</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Updated at</th>
          <th>Created at</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.due_date && formatDate(new Date(task.due_date))}</td>
            <td>{task.assignee}</td>
            <td>{task.status && statusLabels[task.status]}</td>
            <td>{task.priority && priorityLabels[task.priority]}</td>
            <td>{formatDate(new Date(task.created_at))}</td>
            <td>{formatDate(new Date(task.updated_at))}</td>
            <td>
              <div style={{ display: "flex" }}>
                <ButtonGroup aria-label="Actions">
                  <Button
                    variant="light"
                    onClick={() => onUpdateTask(task.id!)}
                    data-testid={`update-button-${task.id}`}
                  >
                    <FaPencil />
                  </Button>
                  <Button
                    variant="light"
                    onClick={() => onDeleteTask(task.id!)}
                    data-testid={`delete-button-${task.id}`}
                  >
                    <FaTrashCan />
                  </Button>
                </ButtonGroup>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
