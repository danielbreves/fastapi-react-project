import { Form, Button } from "react-bootstrap";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Task, PartialTask } from "../types/Task";

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

function mapEntries<T extends Record<string, any>>(obj: T, from: any, to: any) {
  return Object.entries(obj).reduce((result, [field, value]) => {
    result[field as keyof T] = value === from ? to : value;
    return result;
  }, {} as T);
}

export default function TaskForm({ onSaveTask, initialTask }: TaskFormProps) {
  const isUpdate = !!initialTask;
  const { created_at, updated_at, ...defaultValues } = initialTask || {};

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

  const onSubmit = handleSubmit(async (task: PartialTask) => {
    const apiUrl = `${process.env.REACT_APP_BASE_API_URL}/tasks`;

    const modifiedTask = mapEntries(task, "", null);

    try {
      const response = await fetch(
        isUpdate ? `${apiUrl}/${initialTask.id}` : apiUrl,
        {
          method: isUpdate ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(modifiedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      onSaveTask(modifiedTask);
      reset();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
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
      <Form.Group>
        <Form.Label>Description:</Form.Label>
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
      <Form.Group>
        <Form.Label>Date:</Form.Label>
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
      <Form.Group>
        <Form.Label>Assignee:</Form.Label>
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
      <Form.Group>
        <Form.Label>Status:</Form.Label>
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
      <Form.Group>
        <Form.Label>Priority:</Form.Label>
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
      <Button style={{ marginTop: '10px' }} variant="primary" type="submit">
        Save Task
      </Button>
    </Form>
  );
}
