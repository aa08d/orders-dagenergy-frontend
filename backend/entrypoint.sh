#!/bin/sh
set -e

export DJANGO_SETTINGS_MODULE=config.settings

echo "⏳ Waiting for database..."
until python -c "
import psycopg2, os
psycopg2.connect(
    dbname=os.environ['POSTGRES_DB'],
    user=os.environ['POSTGRES_USER'],
    password=os.environ['POSTGRES_PASSWORD'],
    host=os.environ['POSTGRES_HOST'],
    port=os.environ['POSTGRES_PORT'],
)
" 2>/dev/null; do
  echo "  db not ready, retrying..."
  sleep 2
done

echo "✅ Database is ready"
python manage.py migrate --noinput
python manage.py seed_data

exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
