#!/bin/bash
set -e

# Render injects $PORT — default to 8080 for local testing
export PORT="${PORT:-8080}"

echo ">>> Starting unified Typeform Clone service on port $PORT"
echo ">>> Backend (FastAPI) → internal :8000"
echo ">>> Frontend (Next.js) → internal :3000"
echo ">>> Nginx → public :$PORT"

# Substitute $PORT into nginx config at runtime
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Validate nginx config
nginx -t

# Start all processes via supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/app.conf
