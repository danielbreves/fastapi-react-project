import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ManageTasks from "./ManageTasks";
import { deleteTask, getTasks, updateTask } from "./tasks.api";
import { Task, Priority, Status } from "../types/Task";

jest.mock("./tasks.api");

const testData: Task[] = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    due_date: null,
    assignee: null,
    status: Status.IN_PROGRESS,
    priority: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    due_date: null,
    assignee: null,
    status: null,
    priority: Priority.LOW,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockedGetTasks = getTasks as jest.MockedFunction<typeof getTasks>;
const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockedDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;

describe("ManageTasks Component", () => {
  beforeEach(() => {
    mockedGetTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as Response);
  });
  test("renders without errors", async () => {
    await act(async () => render(<ManageTasks />));
  });

  test('opens task form on "Add new" button click', async () => {
    const { getByText } = await act(async () => render(<ManageTasks />));
    const addButton = getByText("Add new");
    await act(async () => fireEvent.click(addButton));
    expect(getByText("Add new task")).toBeInTheDocument();
  });

  test("deletes a task when delete button is clicked in TasksTable", async () => {
    const { container, getByText, queryByText, getByTestId } = await act(
      async () => render(<ManageTasks />)
    );
    await waitFor(() => expect(getByText("Task 1")).toBeInTheDocument());

    expect(getByText("Task 1")).toBeInTheDocument();

    const deleteButton = getByTestId("delete-button-1");

    await act(async () => fireEvent.click(deleteButton));

    mockedDeleteTask.mockResolvedValueOnce({
      ok: true,
    } as Response);

    mockedGetTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => [testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Delete")));

    expect(deleteTask).toHaveBeenCalledWith(1);

    await waitFor(() => expect(queryByText("Task 1")).not.toBeInTheDocument());

    expect(getTasks).toHaveBeenCalledTimes(2);
  });

  test('updates a task when "Update" button is clicked in TasksTable', async () => {
    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(<ManageTasks />)
    );
    await waitFor(() => expect(getByText("Task 1")).toBeInTheDocument());

    expect(getByText("Task 1")).toBeInTheDocument();

    const updateButton = getByTestId("update-button-1");

    await act(async () => fireEvent.click(updateButton));

    expect(getByLabelText("Title*")).toHaveValue("Task 1");
    expect(getByLabelText("Description")).toHaveValue("Description 1");

    await act(async () => {
      fireEvent.change(getByLabelText("Title*"), {
        target: { value: "Updated Task 1" },
      });
      fireEvent.change(getByLabelText("Description"), {
        target: { value: "Updated Description 1" },
      });
      fireEvent.change(getByLabelText("Status"), {
        target: { value: Status.DONE },
      });
    });

    const dataToUpdate = {
      id: 1,
      title: "Updated Task 1",
      description: "Updated Description 1",
      due_date: testData[0].due_date,
      assignee: testData[0].assignee,
      status: Status.DONE,
      priority: testData[0].priority,
    };

    const updatedTask = {
      ...testData[0],
      ...dataToUpdate,
      updated_at: new Date().toISOString(),
    };

    mockedUpdateTask.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    } as Response);

    mockedGetTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => [updatedTask, testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Task")));

    await waitFor(() =>
      expect(getByText("Updated Task 1")).toBeInTheDocument()
    );

    expect(updateTask).toHaveBeenCalledWith(1, dataToUpdate);

    expect(getTasks).toHaveBeenCalledTimes(2);
  });
});
