FROM python:3.14-slim AS builder

ENV PYTHONUNBUFFERED=1 \
    POETRY_VERSION=2.4.1 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app
COPY backend/pyproject.toml backend/poetry.lock ./
RUN poetry install --no-root

COPY backend/ ./

EXPOSE 8000
CMD ["gunicorn", "twitter_clone.wsgi:application", "--bind", "0.0.0.0:8000"]