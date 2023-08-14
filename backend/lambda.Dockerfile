FROM public.ecr.aws/lambda/python:3.10 AS builder

ENV POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_NO_INTERACTION=1

# to run poetry directly as soon as it's installed
ENV PATH="$POETRY_HOME/bin:$PATH"

# install poetry
RUN yum -y update \
    && yum install -y curl \
    && curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app

# copy only pyproject.toml and poetry.lock file nothing else here
COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.create false
RUN poetry install --no-root --no-ansi --without dev

# ---------------------------------------------------------------------

FROM public.ecr.aws/lambda/python:3.10

# PYTHONDONTWRITEBYTECODE: If this is set to a non-empty string, Python won’t try to write .pyc files on the import of source modules.
# PYTHONUNBUFFERED: Force the stdout and stderr streams to be unbuffered. This option has no effect on the stdin stream.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY --from=builder /var/lang/lib/python3.10/site-packages ${LAMBDA_TASK_ROOT}

RUN mkdir ${LAMBDA_TASK_ROOT}/app
WORKDIR /${LAMBDA_TASK_ROOT}/app
COPY app .

CMD ["app.lambda_handler.handler"]