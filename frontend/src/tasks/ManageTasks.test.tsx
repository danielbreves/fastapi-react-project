import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ManageTasks from "./ManageTasks";
import { getProjectTasks } from "../apis/projects.api";
import { deleteTask, updateTask } from "../apis/tasks.api";
import { Task, Priority, Status } from "../types/Task";

jest.mock("../apis/projects.api");
jest.mock("../apis/tasks.api");

function newUTCDatetime() {
  return new Date().toISOString().replace("Z", "");
}

const projectId = 32;

const testData: Task[] = [
  {
    id: 1,
    title: "Task 1",
    description: "Description 1",
    due_date: null,
    assignee: null,
    status: Status.IN_PROGRESS,
    priority: null,
    created_at: newUTCDatetime(),
    updated_at: newUTCDatetime(),
    project_id: projectId,
  },
  {
    id: 2,
    title: "Task 2",
    description: "Description 2",
    due_date: null,
    assignee: null,
    status: null,
    priority: Priority.LOW,
    created_at: newUTCDatetime(),
    updated_at: newUTCDatetime(),
    project_id: projectId,
  },
];

const mockedGetProjectTasks = getProjectTasks as jest.MockedFunction<typeof getProjectTasks>;
const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockedDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;

describe("ManageTasks Component", () => {
  beforeEach(() => {
    mockedGetProjectTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as Response);
  });
  test("renders without errors", async () => {
    await act(async () => render(<ManageTasks projectId={projectId} />));
  });

  test('opens task form on "Add new" button click', async () => {
    const { getByText } = await act(async () => render(<ManageTasks projectId={projectId} />));
    const addButton = getByText("Add new");
    await act(async () => fireEvent.click(addButton));
    expect(getByText("Add new task")).toBeInTheDocument();
  });

  test("deletes a task when delete button is clicked in TasksTable", async () => {
    const { getByText, queryByText, getByTestId } = await act(
      async () => render(<ManageTasks projectId={projectId} />)
    );
    await waitFor(() => expect(getByText("Task 1")).toBeInTheDocument());

    expect(getByText("Task 1")).toBeInTheDocument();

    const deleteButton = getByTestId("delete-button-1");

    await act(async () => fireEvent.click(deleteButton));

    mockedDeleteTask.mockResolvedValueOnce({
      ok: true,
    } as Response);

    mockedGetProjectTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => [testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Delete")));

    expect(deleteTask).toHaveBeenCalledWith(1);

    await waitFor(() => expect(queryByText("Task 1")).not.toBeInTheDocument());

    expect(getProjectTasks).toHaveBeenCalledTimes(2);
  });

  test('updates a task when "Update" button is clicked in TasksTable', async () => {
    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(<ManageTasks projectId={projectId} />)
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

    let { created_at, updated_at, ...dataToUpdate } = testData[0];

    dataToUpdate = {
      ...dataToUpdate,
      title: "Updated Task 1",
      description: "Updated Description 1",
      status: Status.DONE,
    }

    const updatedTask = {
      ...testData[0],
      ...dataToUpdate,
      updated_at: newUTCDatetime(),
    };

    mockedUpdateTask.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    } as Response);

    mockedGetProjectTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => [updatedTask, testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Task")));

    await waitFor(() =>
      expect(getByText("Updated Task 1")).toBeInTheDocument()
    );

    expect(updateTask).toHaveBeenCalledWith(1, dataToUpdate);

    expect(getProjectTasks).toHaveBeenCalledTimes(2);
  });
});
