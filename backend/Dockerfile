# Production Dockerfile for Love Score FastAPI Backend
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install curl for health check
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Security: Create non-root user
RUN addgroup --system --gid 10001 appgroup && \
    adduser --system --uid 10001 --ingroup appgroup --home /app appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set ownership to non-root user
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:${PORT:-8000}/api/health || exit 1

CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
