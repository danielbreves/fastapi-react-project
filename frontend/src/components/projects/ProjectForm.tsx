import { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Project,
  PartialProject,
  Status,
  Priority,
  statusLabels,
  priorityLabels,
} from "../../types/Project";
import { mapEntries } from "../../utils/utils";
import { createProject, updateProject } from "../../apis/projects.api";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  due_date: yup
    .string()
    .test("is-valid-date", "Invalid date format", async (value) =>
      value ? await yup.date().isValid(value) : true
    ),
  assignee: yup.string(),
  status: yup
    .mixed<Status | "">()
    .oneOf([...Object.values(Status), ""])
    .required(),
  priority: yup
    .mixed<Priority | "">()
    .oneOf([...Object.values(Priority), ""])
    .required(),
});

interface ProjectFormProps {
  onSaveProject: (project: PartialProject) => void;
  initialProject?: Project;
  onError: (message: string) => void;
}

export default function ProjectForm({
  onSaveProject,
  initialProject,
  onError,
}: ProjectFormProps) {
  const isUpdate = !!initialProject;
  const { created_at, updated_at, ...defaultValues } = initialProject || {};
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PartialProject>({
    mode: "onBlur",
    resolver: yupResolver<Omit<PartialProject, "id">>(schema),
    defaultValues: isUpdate
      ? mapEntries(defaultValues, null, "")
      : {
          title: "",
          description: "",
          due_date: "",
          assignee: "",
          status: "",
          priority: "",
        },
  });

  function isInvalid(field: keyof PartialProject) {
    return !!errors[field];
  }

  async function doSubmit(project: PartialProject) {
    setLoading(true);

    const modifiedProject = { ...mapEntries(project, "", null) };

    try {
      const response = await (isUpdate
        ? updateProject(initialProject.id, modifiedProject)
        : createProject(modifiedProject));

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      onSaveProject(modifiedProject);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        console.error("Error saving project:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(doSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Title*"
              error={isInvalid("title")}
              helperText={errors.title?.message}
            />
          )}
        />
        <FormControl fullWidth margin="normal">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                error={isInvalid("description")}
                helperText={errors.description?.message}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                InputLabelProps={{ shrink: true }}
                label="Due Date"
                type="date"
                error={isInvalid("due_date")}
                helperText={errors.due_date?.message}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Assignee"
                error={isInvalid("assignee")}
                helperText={errors.assignee?.message}
              />
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="project-status">Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data-testid="select-status"
                labelId="project-status"
                label="Status"
                error={isInvalid("status")}
              >
                <MenuItem data-testid="select-status-none" value="">
                  -
                </MenuItem>
                {Object.entries(statusLabels).map(
                  ([statusValue, statusLabel]) => (
                    <MenuItem
                      data-testid={`select-status-${statusValue}`}
                      key={statusValue}
                      value={statusValue}
                    >
                      {statusLabel}
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="project-priority">Priority</InputLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data-testid="select-priority"
                labelId="project-priority"
                label="Priority"
                error={isInvalid("priority")}
              >
                <MenuItem value="">-</MenuItem>
                {Object.entries(priorityLabels).map(
                  ([priorityValue, priorityLabel]) => (
                    <MenuItem key={priorityValue} value={priorityValue}>
                      {priorityLabel}
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          />
        </FormControl>
        <Box sx={{ marginTop: 2 }}>
          {isLoading ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              size="large"
            >
              Save Project
            </LoadingButton>
          ) : (
            <Button
              size="large"
              variant="contained"
              color="primary"
              type="submit"
            >
              Save Project
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
