# ==========================================
# Unified Dockerfile — Frontend + Backend
# One container, one service, one URL
# Nginx routes: /api/* → FastAPI, /* → Next.js
# ==========================================

# ── Stage 1: Build Next.js frontend ──────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /build/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

# Empty API URL = browser calls /api/* relative to same origin (Nginx routes it)
ENV NEXT_PUBLIC_API_URL=""
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 2: Final unified image ──────────────────────────────────
FROM python:3.11-slim AS final

# Install Node.js 20, Nginx, Supervisor, envsubst
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    nginx \
    supervisor \
    gettext-base \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ── Backend ───────────────────────────────────────────────────────
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend/ ./backend/

# ── Frontend (full build + production node_modules) ───────────────
# Copy package files and install only production deps
COPY --from=frontend-builder /build/frontend/package.json ./frontend/
COPY --from=frontend-builder /build/frontend/package-lock.json ./frontend/
RUN cd /app/frontend && npm ci --omit=dev
# Verify next binary exists — fail build if missing
RUN ls /app/frontend/node_modules/.bin/next

# Copy the built .next directory and public assets
COPY --from=frontend-builder /build/frontend/.next ./frontend/.next
COPY --from=frontend-builder /build/frontend/public ./frontend/public
COPY --from=frontend-builder /build/frontend/next.config.ts ./frontend/next.config.ts

# ── Nginx & Supervisor configs ─────────────────────────────────────
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY supervisord.conf /etc/supervisor/conf.d/app.conf

# ── Startup script ─────────────────────────────────────────────────
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 8080

CMD ["/app/start.sh"]

