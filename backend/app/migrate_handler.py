from alembic.config import Config
from alembic import command

alembic_cfg = Config("./alembic.ini")


def handler(event, context):
    command.upgrade(alembic_cfg, "head")
