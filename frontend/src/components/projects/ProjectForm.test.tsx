import { render, fireEvent, act, within } from "@testing-library/react";
import { createProject, updateProject } from "../../apis/projects.api";
import { Project, Status } from "../../types/Project";
import ProjectForm from "./ProjectForm";

jest.mock("../../apis/projects.api");
jest.mock("../../apis/projects.api");

function newUTCDatetime() {
  return new Date().toISOString().replace("Z", "");
}

const projectId = 32;

const testData: Project = {
  id: 1,
  title: "Project 1",
  description: "Description 1",
  due_date: null,
  assignee: null,
  status: Status.IN_PROGRESS,
  priority: null,
  created_at: newUTCDatetime(),
  updated_at: newUTCDatetime(),
};

const mockedUpdateProject = updateProject as jest.MockedFunction<typeof updateProject>;
const mockedCreateProject = createProject as jest.MockedFunction<typeof createProject>;

describe("ProjectForm Component", () => {
  test("renders without errors", async () => {
    await act(async () =>
      render(
        <ProjectForm
          onSaveProject={() => {}}
          onError={() => {}}
        />
      )
    );
  });

  test('adds a project when "Save Project" button is clicked', async () => {
    const onSaveProject = jest.fn();

    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(
        <ProjectForm
          onSaveProject={onSaveProject}
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

    const newProject = {
      ...dataToSave,
      created_at: newUTCDatetime(),
      updated_at: newUTCDatetime(),
    };

    mockedCreateProject.mockResolvedValueOnce({
      ok: true,
      json: async () => newProject,
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Project")));

    expect(createProject).toHaveBeenCalledWith(dataToSave);
    expect(onSaveProject).toHaveBeenCalledWith(dataToSave);
  });

  test('updates a project when given an initialProject and "Save Project" button is clicked', async () => {
    const onSaveProject = jest.fn();

    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(
        <ProjectForm
          onSaveProject={onSaveProject}
          initialProject={testData}
          onError={() => {}}
        />
      )
    );

    expect(getByLabelText("Title*")).toHaveValue("Project 1");
    expect(getByLabelText("Description")).toHaveValue("Description 1");

    let { created_at, updated_at, ...dataToUpdate } = testData;

    dataToUpdate = {
      ...dataToUpdate,
      title: "Updated Project 1",
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

    const updatedProject = {
      ...testData,
      ...dataToUpdate,
      updated_at: newUTCDatetime(),
    };

    mockedUpdateProject.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProject,
    } as Response);

    await act(async () => fireEvent.click(getByText("Save Project")));

    expect(updateProject).toHaveBeenCalledWith(testData.id, dataToUpdate);
    expect(onSaveProject).toHaveBeenCalledWith(dataToUpdate);
  });
});
