from app.domains.tasks.db.projects import project_dtos
from sqlalchemy.orm import Session
from . import project_entity


def get_project(db: Session, project_id: int):
    return db.query(project_entity.Project).filter(project_entity.Project.id == project_id).first()


def get_project_by_title(db: Session, title: str) -> project_dtos.ProjectBase:
    return db.query(project_entity.Project).filter(project_entity.Project.title == title).first()


def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(project_entity.Project).order_by(project_entity.Project.created_at.desc()).offset(skip).limit(limit).all()


def create_project(db: Session, project: project_dtos.ProjectCreate):
    db_project = project_entity.Project(
        **project.model_dump(exclude_unset=True))
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project_id: int, project: project_dtos.ProjectUpdate):
    db_project = db.query(project_entity.Project).filter(
        project_entity.Project.id == project_id).first()
    for key, value in project.model_dump(exclude_unset=True).items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, project_id: int):
    db_project = db.query(project_entity.Project).filter(
        project_entity.Project.id == project_id).first()
    db.delete(db_project)
    db.commit()
    return db_project
