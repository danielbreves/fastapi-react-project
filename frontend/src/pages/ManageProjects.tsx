import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import ProjectForm from "../components/projects/ProjectForm";
import SlideOver from "../components/shared/SlideOver";
import { Project } from "../components/../types/Project";
import ConfirmDeleteModal from "../components/shared/ConfirmDelete";
import ProjectsTable from "../components/projects/ProjectsTable";
import { deleteProject, getProjects } from "../apis/projects.api";
import ErrorToast from "../components/shared/ErrorToast";
import Loading from "../components/shared/Loading";

export default function ManageProjects({ createNew }: { createNew?: boolean}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectForm, setShowProjectForm] = useState<boolean>(createNew || false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [requestsInProgress, setRequestsInProgress] = useState<
    Promise<Response>[]
  >([]);

  function handleSaveProject() {
    fetchProjects();
    closeProjectForm();
  }

  function closeProjectForm() {
    setShowProjectForm(false);
    setEditingProjectId(null);
  }

  function handleUpdateProject(projectId: number) {
    setEditingProjectId(projectId);
    setShowProjectForm(true);
  }

  function handleDeleteProject(projectId: number) {
    setProjectIdToDelete(projectId);
    setShowDeleteModal(true);
  }

  function resetDeleteProject() {
    setProjectIdToDelete(null);
    setShowDeleteModal(false);
  }

  function doDeleteProject() {
    if (!projectIdToDelete) {
      return;
    }

    const currentReq = deleteProject(projectIdToDelete);
    resetDeleteProject();

    (async () => {
      try {
        setRequestsInProgress((prev) => [...prev, currentReq]);

        const response = await currentReq;

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        fetchProjects();
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          console.error("Error deleting project:", error);
        }
      } finally {
        setRequestsInProgress((prevReqs) =>
          prevReqs.filter((prev) => prev !== currentReq)
        );
      }
    })();
  }

  function fetchProjects() {
    const controller = new AbortController();

    (async () => {
      const currentReq = getProjects(controller.signal);
      try {
        setRequestsInProgress((prev) => [...prev, currentReq]);

        const response = await currentReq;

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        setProjects(await response.json());
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErrorMessage(error.message);
        } else {
          console.error("Error fetching projects:", error);
        }
      } finally {
        setRequestsInProgress((prevReqs) =>
          prevReqs.filter((prev) => prev !== currentReq)
        );
      }
    })();

    return () => controller.abort();
  }

  useEffect(fetchProjects, []);

  return (
    <>
      <Button variant="outlined" onClick={() => setShowProjectForm(true)}>
        Add new
      </Button>
      {!!requestsInProgress.length && <Loading />}
      <SlideOver
        show={showProjectForm}
        onHide={closeProjectForm}
        title={editingProjectId ? "Update project" : "Add new project"}
      >
        <ProjectForm
          onSaveProject={handleSaveProject}
          initialProject={
            editingProjectId
              ? projects.find((project) => project.id === editingProjectId)
              : undefined
          }
          onError={(message: string) => setErrorMessage(message)}
        />
      </SlideOver>
      <ErrorToast
        message={errorMessage}
        handleClose={() => setErrorMessage("")}
      />
      <ProjectsTable
        projects={projects}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
      />
      <ConfirmDeleteModal
        showDeleteModal={showDeleteModal}
        handleDelete={doDeleteProject}
        handleCancel={resetDeleteProject}
      />
    </>
  );
}
