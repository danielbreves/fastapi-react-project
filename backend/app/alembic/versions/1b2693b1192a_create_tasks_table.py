"""create tasks table

Revision ID: 1b2693b1192a
Revises: 91979b40eb38
Create Date: 2023-07-29 01:08:51.647061-07:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import func
from typing import Optional


# revision identifiers, used by Alembic.
revision = '1b2693b1192a'
down_revision = '91979b40eb38'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('date', sa.Date(), nullable=True),
        sa.Column('assignee', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('priority', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(),
                  server_default=func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), server_default=func.now(),
                  onupdate=func.now(), nullable=False),
    )


def downgrade():
    op.drop_table('tasks')
