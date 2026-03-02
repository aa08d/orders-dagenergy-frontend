FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x /app/entrypoint.sh

# Collect static files at build time (whitenoise serves them, no DB needed)
RUN DJANGO_SECRET_KEY=build-secret \
    POSTGRES_DB=dummy POSTGRES_USER=dummy POSTGRES_PASSWORD=dummy \
    POSTGRES_HOST=dummy POSTGRES_PORT=5432 \
    python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["/bin/sh", "/app/entrypoint.sh"]
