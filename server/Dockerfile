FROM python:3.14.6-slim@sha256:7bec7ddcddeff7975d6ba9b4be7dd6f6b2f55e7491539145e2978f7f97ce9144
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 CHATKIT_ENV=production
COPY server/requirements.lock /app/server/requirements.lock
RUN pip install --no-cache-dir -r server/requirements.lock && useradd --uid 10001 --create-home app
COPY server/*.py /app/server/
USER 10001
EXPOSE 8080
CMD ["sh", "-c", "exec python -m uvicorn server.app:app --host 0.0.0.0 --port ${PORT:-8080} --workers 1 --no-access-log"]
