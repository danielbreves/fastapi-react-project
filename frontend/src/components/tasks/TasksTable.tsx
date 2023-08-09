import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
} from "@mui/material";
import { Task, priorityLabels, statusLabels } from "../../types/Task";
import { FaTrashCan, FaPencil } from "react-icons/fa6";
import { formatDate } from "../../utils/utils";

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
      <TableHead>
        <TableRow>
          <TableCell>Title</TableCell>
          <TableCell>Description</TableCell>
          <TableCell>Due date</TableCell>
          <TableCell>Assignee</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Priority</TableCell>
          <TableCell>Created at</TableCell>
          <TableCell>Updated at</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>
              {task.due_date && formatDate(new Date(task.due_date))}
            </TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell>
              {task.status && statusLabels[task.status]}
            </TableCell>
            <TableCell>
              {task.priority && priorityLabels[task.priority]}
            </TableCell>
            <TableCell>
              {formatDate(new Date(`${task.created_at}+00:00`), true)}
            </TableCell>
            <TableCell>
              {formatDate(new Date(`${task.updated_at}+00:00`), true)}
            </TableCell>
            <TableCell>
              <ButtonGroup aria-label="Actions">
                <Button
                  variant="outlined"
                  onClick={() => onUpdateTask(task.id!)}
                  data-testid={`update-button-${task.id}`}
                >
                  <FaPencil />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onDeleteTask(task.id!)}
                  data-testid={`delete-button-${task.id}`}
                >
                  <FaTrashCan />
                </Button>
              </ButtonGroup>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
