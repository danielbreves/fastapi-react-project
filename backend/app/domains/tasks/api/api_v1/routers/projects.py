from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.domains.tasks.db.projects import project_repository, project_dtos

projects_router = r = APIRouter()


# Route to get a project by its ID
@r.get("/projects/{project_id}", response_model=project_dtos.Project)
async def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = project_repository.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


# Route to get a list of projects with optional pagination
@r.get("/projects", response_model=List[project_dtos.Project])
async def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return project_repository.get_projects(db, skip=skip, limit=limit)


# Route to create a new project
@r.post("/projects", response_model=project_dtos.Project, status_code=201)
async def create_project(project: project_dtos.ProjectCreate, db: Session = Depends(get_db)):
    return project_repository.create_project(db, project)


# Route to update an existing project
@r.put("/projects/{project_id}", response_model=project_dtos.Project)
async def update_project(project_id: int, project: project_dtos.ProjectUpdate, db: Session = Depends(get_db)):
    db_project = project_repository.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_repository.update_project(db, project_id, project)


# Route to delete a project
@r.delete("/projects/{project_id}", response_model=project_dtos.Project)
async def delete_project(project_id: int, db: Session = Depends(get_db)):
    db_project = project_repository.get_project(db, project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_repository.delete_project(db, project_id)
