#!/usr/bin/env bash
set -e

echo "Esperando a que la base de datos esté lista..."

until nc -z db 5432; do
  sleep 1
done

echo "DB lista, aplicando migraciones..."
alembic upgrade head

echo "Levantando API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
