import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ManageTasks from "./ManageTasks";
import { getProjectTasks } from "../../apis/projects.api";
import { deleteTask } from "../../apis/tasks.api";
import { Task, Priority, Status } from "../../types/Task";
import { newUTCDatetime } from "../../test-utils/utils";

jest.mock("../../apis/projects.api");
jest.mock("../../apis/tasks.api");

const projectId = 32;

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({ projectId: String(projectId) }),
  };
});

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

const mockedGetProjectTasks = getProjectTasks as jest.MockedFunction<
  typeof getProjectTasks
>;
const mockedDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;

describe("ManageTasks Component", () => {
  beforeEach(() => {
    mockedGetProjectTasks.mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as Response);
  });
  test("renders without errors", async () => {
    await act(async () => render(<ManageTasks />));
  });

  test('opens task form when "Add new" button is clicked', async () => {
    const { getByText } = await act(async () => render(<ManageTasks />));
    const addButton = getByText("Add new");
    await act(async () => fireEvent.click(addButton));
    expect(getByText("Add new task")).toBeInTheDocument();
  });

  test("opens an update task form with task data when the update button is clicked on a task", async () => {
    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(<ManageTasks />)
    );

    await waitFor(() => expect(getByText("Task 1")).toBeInTheDocument());

    const updateButton = getByTestId("update-button-1");

    await act(async () => fireEvent.click(updateButton));

    expect(getByText("Update task")).toBeInTheDocument();
    expect(getByLabelText("Title*")).toHaveValue("Task 1");
    expect(getByLabelText("Description")).toHaveValue("Description 1");
  });

  test("deletes a task when delete button is clicked on a task", async () => {
    const { getByText, queryByText, getByTestId } = await act(async () =>
      render(<ManageTasks />)
    );

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
});
