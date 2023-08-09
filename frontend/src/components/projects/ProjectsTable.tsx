import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Link,
} from "@mui/material";
import { Project, priorityLabels, statusLabels } from "../../types/Project";
import { FaTrashCan, FaPencil } from "react-icons/fa6";
import { formatDate } from "../../utils/utils";
import { Link as RouterLink } from "react-router-dom";

interface ProjectsTableProps {
  projects: Project[];
  onUpdateProject: (projectId: number) => void;
  onDeleteProject: (projectId: number) => void;
}

export default function ProjectsTable({
  projects,
  onUpdateProject,
  onDeleteProject,
}: ProjectsTableProps) {
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
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <Link component={RouterLink} to={`/projects/${project.id}/tasks`}>
                {project.title}
              </Link>
            </TableCell>
            <TableCell>{project.description}</TableCell>
            <TableCell>
              {project.due_date && formatDate(new Date(project.due_date))}
            </TableCell>
            <TableCell>{project.assignee}</TableCell>
            <TableCell>
              {project.status && statusLabels[project.status]}
            </TableCell>
            <TableCell>
              {project.priority && priorityLabels[project.priority]}
            </TableCell>
            <TableCell>
              {formatDate(new Date(`${project.created_at}+00:00`), true)}
            </TableCell>
            <TableCell>
              {formatDate(new Date(`${project.updated_at}+00:00`), true)}
            </TableCell>
            <TableCell>
              <ButtonGroup aria-label="Actions">
                <Button
                  variant="outlined"
                  onClick={() => onUpdateProject(project.id!)}
                  data-testid={`update-button-${project.id}`}
                >
                  <FaPencil />
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => onDeleteProject(project.id!)}
                  data-testid={`delete-button-${project.id}`}
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
