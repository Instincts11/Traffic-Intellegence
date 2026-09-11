# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    RENDER=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Lightweight deps by default (good for free/demo hosts).
# For full ML: docker build --build-arg REQUIREMENTS_FILE=requirements.txt
ARG REQUIREMENTS_FILE=requirements-render.txt
COPY ${REQUIREMENTS_FILE} requirements.txt
RUN pip install -r requirements.txt

COPY app.py app_full_ml.py package.json ./
COPY utils ./utils
COPY data ./data
COPY models ./models
COPY scripts ./scripts
COPY static ./static

RUN mkdir -p static/uploads

EXPOSE 5000

CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000", "--workers", "1", "--threads", "4", "--timeout", "120"]
