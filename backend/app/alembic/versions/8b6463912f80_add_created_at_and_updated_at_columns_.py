"""Add created_at and updated_at columns to users table

Revision ID: 8b6463912f80
Revises: 1b2693b1192a
Create Date: 2023-07-29 01:18:59.202554-07:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import func

# revision identifiers, used by Alembic.
revision = '8b6463912f80'
down_revision = '1b2693b1192a'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('created_at', sa.DateTime(),
                  server_default=func.now(), nullable=False))
    op.add_column('user', sa.Column('updated_at', sa.DateTime(
    ), server_default=func.now(), onupdate=func.now(), nullable=False))


def downgrade():
    op.drop_column('user', 'updated_at')
    op.drop_column('user', 'created_at')
