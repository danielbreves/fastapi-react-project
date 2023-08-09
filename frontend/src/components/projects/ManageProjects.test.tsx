import { render, fireEvent, waitFor, act } from "@testing-library/react";
import ManageProjects from "./ManageProjects";
import { getProjects } from "../../apis/projects.api";
import { deleteProject } from "../../apis/projects.api";
import { Project, Priority, Status } from "../../types/Project";
import { newUTCDatetime } from "../../test-utils/utils";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../apis/projects.api");

const testData: Project[] = [
  {
    id: 1,
    title: "Project 1",
    description: "Description 1",
    due_date: null,
    assignee: null,
    status: Status.IN_PROGRESS,
    priority: null,
    created_at: newUTCDatetime(),
    updated_at: newUTCDatetime(),
  },
  {
    id: 2,
    title: "Project 2",
    description: "Description 2",
    due_date: null,
    assignee: null,
    status: null,
    priority: Priority.LOW,
    created_at: newUTCDatetime(),
    updated_at: newUTCDatetime(),
  },
];

const mockedGetProjectProjects = getProjects as jest.MockedFunction<
  typeof getProjects
>;
const mockedDeleteProject = deleteProject as jest.MockedFunction<
  typeof deleteProject
>;

describe("ManageProjects Component", () => {
  beforeEach(() => {
    mockedGetProjectProjects.mockResolvedValueOnce({
      ok: true,
      json: async () => testData,
    } as Response);
  });
  test("renders without errors", async () => {
    await act(async () =>
      render(
        <MemoryRouter>
          <ManageProjects />
        </MemoryRouter>
      )
    );
  });

  test('opens project form when "Add new" button is clicked', async () => {
    const { getByText } = await act(async () =>
      render(
        <MemoryRouter>
          <ManageProjects />
        </MemoryRouter>
      )
    );
    const addButton = getByText("Add new");
    await act(async () => fireEvent.click(addButton));
    expect(getByText("Add new project")).toBeInTheDocument();
  });

  test("opens an update project form with project data when the update button is clicked on a project", async () => {
    const { getByText, getByLabelText, getByTestId } = await act(async () =>
      render(
        <MemoryRouter>
          <ManageProjects />
        </MemoryRouter>
      )
    );

    await waitFor(() => expect(getByText("Project 1")).toBeInTheDocument());

    const updateButton = getByTestId("update-button-1");

    await act(async () => fireEvent.click(updateButton));

    expect(getByText("Update project")).toBeInTheDocument();
    expect(getByLabelText("Title*")).toHaveValue("Project 1");
    expect(getByLabelText("Description")).toHaveValue("Description 1");
  });

  test("deletes a project when delete button is clicked on a project", async () => {
    const { getByText, queryByText, getByTestId } = await act(async () =>
      render(
        <MemoryRouter>
          <ManageProjects />
        </MemoryRouter>
      )
    );

    expect(getByText("Project 1")).toBeInTheDocument();

    const deleteButton = getByTestId("delete-button-1");

    await act(async () => fireEvent.click(deleteButton));

    mockedDeleteProject.mockResolvedValueOnce({
      ok: true,
    } as Response);

    mockedGetProjectProjects.mockResolvedValueOnce({
      ok: true,
      json: async () => [testData[1]],
    } as Response);

    await act(async () => fireEvent.click(getByText("Delete")));

    expect(deleteProject).toHaveBeenCalledWith(1);

    await waitFor(() =>
      expect(queryByText("Project 1")).not.toBeInTheDocument()
    );

    expect(getProjects).toHaveBeenCalledTimes(2);
  });
});
