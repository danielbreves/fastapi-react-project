import { Form, Button } from "react-bootstrap";
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
} from "../types/Task";
import { mapEntries } from "../utils/utils";
import { createTask, updateTask } from "../apis/tasks.api";
import { useState } from "react";
import ErrorToast from "../shared/Toast";
import LoadingSpinner from "../shared/LoadingSpinner";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  due_date: yup
    .string()
    .test("is-valid-date", "Invalid date format", async (value) =>
      value ? await yup.date().isValid(value) : true
    ),
  assignee: yup.string(),
  status: yup.mixed<Status>().optional(),
  priority: yup.mixed<Priority>().optional(),
});

interface TaskFormProps {
  onSaveTask: (task: PartialTask) => void;
  initialTask?: Task;
  projectId: number;
}

export default function TaskForm({ onSaveTask, initialTask, projectId }: TaskFormProps) {
  const isUpdate = !!initialTask;
  const { created_at, updated_at, ...defaultValues } = initialTask || {};
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors, touchedFields },
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
          status: undefined,
          priority: undefined,
        },
  });

  function isValid(field: keyof PartialTask) {
    return touchedFields[field] && !errors[field] && !!getValues(field);
  }

  function isInvalid(field: keyof PartialTask) {
    return touchedFields[field] && !!errors[field];
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
        setErrorMessage(error.message);
      } else {
        console.error("Error saving task:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ErrorToast
        message={errorMessage}
        handleClose={() => setErrorMessage("")}
      />
      <Form onSubmit={handleSubmit(doSubmit)}>
        <Form.Group controlId="task-title">
          <Form.Label>Title*</Form.Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                isValid={isValid("title")}
                isInvalid={isInvalid("title")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.title?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="task-description">
          <Form.Label>Description</Form.Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                as="textarea"
                isValid={isValid("description")}
                isInvalid={isInvalid("description")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.description?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="task-date">
          <Form.Label>Due Date</Form.Label>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="date"
                isValid={isValid("due_date")}
                isInvalid={isInvalid("due_date")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.due_date?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="task-assignee">
          <Form.Label>Assignee</Form.Label>
          <Controller
            name="assignee"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="text"
                isValid={isValid("assignee")}
                isInvalid={isInvalid("assignee")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.assignee?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="task-status">
          <Form.Label>Status</Form.Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Form.Select
                {...field}
                isValid={isValid("status")}
                isInvalid={isInvalid("status")}
              >
                <option key="empty" value="">
                  -
                </option>
                {Object.entries(statusLabels).map(
                  ([statusValue, statusLabel]) => (
                    <option key={statusValue} value={statusValue}>
                      {statusLabel}
                    </option>
                  )
                )}
              </Form.Select>
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.status?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="task-priority">
          <Form.Label>Priority</Form.Label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Form.Select
                {...field}
                isValid={isValid("priority")}
                isInvalid={isInvalid("priority")}
              >
                <option key="empty" value="">
                  -
                </option>
                {Object.entries(priorityLabels).map(
                  ([priorityValue, priorityLabel]) => (
                    <option key={priorityValue} value={priorityValue}>
                      {priorityLabel}
                    </option>
                  )
                )}
              </Form.Select>
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.priority?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          style={{ marginTop: "10px" }}
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && (
            <LoadingSpinner
              as="span"
              size="sm"
              style={{ marginRight: "5px" }}
            />
          )}
          Save Task
        </Button>
      </Form>
    </>
  );
}
