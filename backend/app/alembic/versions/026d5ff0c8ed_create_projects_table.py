"""Create projects table

Revision ID: 026d5ff0c8ed
Revises: 8b6463912f80
Create Date: 2023-08-06 21:33:17.947048-07:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '026d5ff0c8ed'
down_revision = '8b6463912f80'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "projects",
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('due_date', sa.Date(), nullable=True),
        sa.Column('assignee', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('priority', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(),
                  server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(),
                  onupdate=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table("projects")
