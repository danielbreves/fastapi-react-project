import { Table, Button } from "react-bootstrap";
import { Task } from "../types/Task";
import { FaTrashCan, FaPencil } from "react-icons/fa6";

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
          <th>Date</th>
          <th>Assignee</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.date}</td>
            <td>{task.assignee}</td>
            <td>{task.status}</td>
            <td>{task.priority}</td>
            <td>
              <div style={{ display: "flex" }}>
                <Button
                  variant="light"
                  onClick={() => onUpdateTask(task.id!)}
                >
                  <FaPencil />
                </Button>
                <Button variant="light" onClick={() => onDeleteTask(task.id!)}>
                  <FaTrashCan />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
