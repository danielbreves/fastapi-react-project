import "bootstrap/dist/css/bootstrap.css";
import { Form, Button } from "react-bootstrap";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface CreateTask {
  title: string;
  description?: string;
  date?: string;
  assignee?: string;
  status?: string;
  priority?: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  date: yup.string(),
  assignee: yup.string(),
  status: yup.string(),
  priority: yup.string(),
});

interface AddNewFormProps {
  onAddTask: (newTask: CreateTask) => void;
}

export default function AddNewForm({ onAddTask }: AddNewFormProps) {
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    formState: { errors, touchedFields },
  } = useForm<CreateTask>({
    mode: "onBlur",
    resolver: yupResolver<CreateTask>(schema),
  });

  function isValid(field: keyof CreateTask) {
    return touchedFields[field] && !errors[field] && !!getValues(field);
  }

  function isInvalid(field: keyof CreateTask) {
    return touchedFields[field] && !!errors[field];
  }

  const onSubmit = handleSubmit(async (newTask: CreateTask) => {
    const modifiedTask = Object.entries(newTask).reduce(
      (task, [field, value]) => {
        if (value !== undefined && value !== "") {
          task[field as keyof CreateTask] = value;
        }
        return task;
      },
      {} as CreateTask
    );

    try {
      const response = await fetch("http://localhost:8000/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      onAddTask(modifiedTask);
      reset();
    } catch (error) {
      // Handle any error that occurs during the request
      console.error("Error adding task:", error);
    }
  });

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group>
        <Form.Label>Title:</Form.Label>
        <Controller
          name="title"
          control={control}
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
          defaultValue=""
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
      <Button className="submit-button" variant="primary" type="submit">
        Add Task
      </Button>
    </Form>
  );
}
