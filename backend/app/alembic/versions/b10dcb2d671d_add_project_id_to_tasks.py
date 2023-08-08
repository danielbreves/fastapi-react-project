"""Add project_id to tasks

Revision ID: b10dcb2d671d
Revises: 026d5ff0c8ed
Create Date: 2023-08-08 07:55:52.387897

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b10dcb2d671d'
down_revision = '026d5ff0c8ed'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tasks', sa.Column('project_id', sa.Integer(),
                  sa.ForeignKey('projects.id'), nullable=True))


def downgrade():
    op.drop_column('tasks', 'project_id')
