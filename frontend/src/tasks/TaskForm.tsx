import { Form, Button } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Task, PartialTask } from "../types/Task";
import { mapEntries } from "../utils/utils";
import { createTask, updateTask } from "./tasks.api";
import { useState } from "react";
import ErrorToast from "../shared/Toast";
import LoadingSpinner from "../shared/LoadingSpinner";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  date: yup.string(),
  assignee: yup.string(),
  status: yup.string(),
  priority: yup.string(),
});

interface TaskFormProps {
  onSaveTask: (task: PartialTask) => void;
  initialTask?: Task;
}

export default function TaskForm({ onSaveTask, initialTask }: TaskFormProps) {
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
          date: "",
          assignee: "",
          status: "",
          priority: "",
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
    const modifiedTask = mapEntries(task, "", null);

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
          <Form.Label>Date</Form.Label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Form.Control
                {...field}
                type="date"
                isValid={isValid("date")}
                isInvalid={isInvalid("date")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.date?.message}
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
              <Form.Control
                {...field}
                type="text"
                isValid={isValid("status")}
                isInvalid={isInvalid("status")}
              />
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
              <Form.Control
                {...field}
                type="text"
                isValid={isValid("priority")}
                isInvalid={isInvalid("priority")}
              />
            )}
          />
          <Form.Control.Feedback type="invalid">
            {errors.priority?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button style={{ marginTop: "10px" }} variant="primary" type="submit" disabled={isLoading}>
          {isLoading && <LoadingSpinner as="span" size="sm" style={{ marginRight: "5px" }} />}
          Save Task
        </Button>
      </Form>
    </>
  );
}
