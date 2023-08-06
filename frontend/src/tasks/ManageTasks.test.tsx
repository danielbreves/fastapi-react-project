import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ManageTasks from "./ManageTasks";
import { deleteTask, getTasks, updateTask } from "./tasks.api";
import { PartialTask } from "../types/Task";

jest.mock("./tasks.api");

const testData: PartialTask[] = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    date: "",
    assignee: "",
    status: "",
    priority: "",
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    date: "",
    assignee: "",
    status: "",
    priority: "",
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
    });

    mockedUpdateTask.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: "Updated Task 1",
        description: "Updated Description 1",
      }),
    } as Response);

    const updatedTask = {
      id: 1,
      title: "Updated Task 1",
      description: "Updated Description 1",
      date: null,
      assignee: null,
      status: null,
      priority: null,
    };

    mockedGetTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => [updatedTask, testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Task")));

    await waitFor(() =>
      expect(getByText("Updated Task 1")).toBeInTheDocument()
    );

    expect(updateTask).toHaveBeenCalledWith(1, updatedTask);

    expect(getTasks).toHaveBeenCalledTimes(2);
  });
});
