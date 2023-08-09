import {
  render,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import ManageTasks from "./ManageTasks";
import { getProjectTasks } from "../../apis/projects.api";
import { createTask, deleteTask, updateTask } from "../../apis/tasks.api";
import { Task, Status, PartialTask } from "../../types/Task";
import TaskForm from "./TaskForm";

jest.mock("../../apis/projects.api");
jest.mock("../../apis/tasks.api");

function newUTCDatetime() {
  return new Date().toISOString().replace("Z", "");
}

const projectId = 32;

const testData: Task = {
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
};

const mockedUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockedCreateTask = createTask as jest.MockedFunction<typeof createTask>;

describe("TaskForm Component", () => {
  test("renders without errors", async () => {
    await act(async () =>
      render(
        <TaskForm
          onSaveTask={() => {}}
          projectId={projectId}
          onError={() => {}}
        />
      )
    );
  });

  test('adds a task when "Save Task" button is clicked', async () => {
    const onSaveTask = jest.fn();

    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(
        <TaskForm
          onSaveTask={onSaveTask}
          projectId={projectId}
          onError={() => {}}
        />
      )
    );

    expect(getByLabelText("Title*")).toHaveValue("");
    expect(getByLabelText("Description")).toHaveValue("");

    await act(async () => {
      fireEvent.change(getByLabelText("Title*"), {
        target: { value: testData.title },
      });
      fireEvent.change(getByLabelText("Description"), {
        target: { value: testData.description },
      });
      const { getByRole } = within(getByTestId("select-status"));
      const select = getByRole("button");
      fireEvent.mouseDown(select);
    });

    fireEvent.click(getByTestId(`select-status-${testData.status}`));

    let { created_at, updated_at, id, ...dataToSave } = testData;

    const newTask = {
      ...dataToSave,
      created_at: newUTCDatetime(),
      updated_at: newUTCDatetime(),
    };

    mockedCreateTask.mockResolvedValueOnce({
      ok: true,
      json: async () => newTask,
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Task")));

    expect(createTask).toHaveBeenCalledWith(dataToSave);
    expect(onSaveTask).toHaveBeenCalledWith(dataToSave);
  });

  test('updates a task when given an initialTask and "Save Task" button is clicked', async () => {
    const onSaveTask = jest.fn();

    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(
        <TaskForm
          onSaveTask={onSaveTask}
          initialTask={testData}
          projectId={projectId}
          onError={() => {}}
        />
      )
    );

    expect(getByLabelText("Title*")).toHaveValue("Task 1");
    expect(getByLabelText("Description")).toHaveValue("Description 1");

    let { created_at, updated_at, ...dataToUpdate } = testData;

    dataToUpdate = {
      ...dataToUpdate,
      title: "Updated Task 1",
      description: "Updated Description 1",
      status: Status.DONE,
    };

    await act(async () => {
      fireEvent.change(getByLabelText("Title*"), {
        target: { value: dataToUpdate.title },
      });
      fireEvent.change(getByLabelText("Description"), {
        target: { value: dataToUpdate.description },
      });
      const { getByRole } = within(getByTestId("select-status"));
      const select = getByRole("button");
      fireEvent.mouseDown(select);
    });

    fireEvent.click(getByTestId(`select-status-${dataToUpdate.status}`));

    const updatedTask = {
      ...testData,
      ...dataToUpdate,
      updated_at: newUTCDatetime(),
    };

    mockedUpdateTask.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedTask,
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Task")));

    expect(updateTask).toHaveBeenCalledWith(testData.id, dataToUpdate);
    expect(onSaveTask).toHaveBeenCalledWith(dataToUpdate);
  });
});
