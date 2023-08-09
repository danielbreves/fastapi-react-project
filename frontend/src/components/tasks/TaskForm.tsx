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
  Task,
  PartialTask,
  Status,
  Priority,
  statusLabels,
  priorityLabels,
} from "../../types/Task";
import { mapEntries } from "../../utils/utils";
import { createTask, updateTask } from "../../apis/tasks.api";

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

interface TaskFormProps {
  onSaveTask: (task: PartialTask) => void;
  initialTask?: Task;
  projectId: number;
  onError: (message: string) => void;
}

export default function TaskForm({
  onSaveTask,
  initialTask,
  projectId,
  onError,
}: TaskFormProps) {
  const isUpdate = !!initialTask;
  const { created_at, updated_at, ...defaultValues } = initialTask || {};
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PartialTask>({
    mode: "onBlur",
    resolver: yupResolver<Omit<PartialTask, "id">>(schema),
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

  function isInvalid(field: keyof PartialTask) {
    return !!errors[field];
  }

  async function doSubmit(task: PartialTask) {
    setLoading(true);

    const modifiedTask = {
      ...mapEntries(task, "", null),
      project_id: projectId,
    };

    try {
      const response = await (isUpdate
        ? updateTask(initialTask.id, modifiedTask)
        : createTask(modifiedTask));

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      onSaveTask(modifiedTask);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        console.error("Error saving task:", error);
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
          <InputLabel id="task-status">Status</InputLabel>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data-testid="select-status"
                labelId="task-status"
                label="Status"
                error={isInvalid("status")}
              >
                <MenuItem data-testid="select-status-none" value="">-</MenuItem>
                {Object.entries(statusLabels).map(
                  ([statusValue, statusLabel]) => (
                    <MenuItem data-testid={`select-status-${statusValue}`} key={statusValue} value={statusValue}>
                      {statusLabel}
                    </MenuItem>
                  )
                )}
              </Select>
            )}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="task-priority">Priority</InputLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                data-testid="select-priority"
                labelId="task-priority"
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
              Save Task
            </LoadingButton>
          ) : (
            <Button
              size="large"
              variant="contained"
              color="primary"
              type="submit"
            >
              Save Task
            </Button>
          )}
        </Box>
      </form>
    </>
  );
}
