FROM python:3.12-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/opt/venv/bin:$PATH" \
    DJANGO_SETTINGS_MODULE=portfolio.settings

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -m -u 1000 django

WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY --chown=django:django . .
RUN mkdir -p /app/staticfiles \
    && chown -R django:django /app/staticfiles

USER django

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1

CMD sh -c "python manage.py collectstatic --noinput && python manage.py migrate && python manage.py seed_admin && gunicorn --bind 0.0.0.0:8000 --workers 3 --worker-class sync --timeout 120 --access-logfile - --error-logfile - portfolio.wsgi:application"
