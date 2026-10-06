from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import forms, questions, public, analytics
import os
import re

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Typeform Clone API",
    description="Backend API powering the Typeform Clone builder, respondent flow, and response analytics.",
    version="1.0.0"
)

# ── CORS: Auto-detecting origin allowlist ─────────────────────────────────────
# Priority 1: Explicit list via ALLOWED_ORIGINS env var (comma-separated)
# Priority 2: Auto-allow based on known patterns (localhost + deployment platforms)
_explicit_origins = os.getenv("ALLOWED_ORIGINS", "")

if _explicit_origins:
    # Explicit list takes highest priority
    _origins = [o.strip() for o in _explicit_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Auto-detect: allow localhost (any port) + major deployment platforms
    _auto_pattern = (
        r"^https?://localhost(:\d+)?$"               # local dev
        r"|^https?://127\.0\.0\.1(:\d+)?$"           # local dev (IP)
        r"|^https://[\w-]+\.onrender\.com$"           # Render
        r"|^https://[\w-]+\.railway\.app$"            # Railway
        r"|^https://[\w-]+\.vercel\.app$"             # Vercel
        r"|^https://[\w-]+\.netlify\.app$"            # Netlify
        r"|^https://[\w-]+\.fly\.dev$"                # Fly.io
        r"|^https://[\w-]+\.pages\.dev$"              # Cloudflare Pages
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=_auto_pattern,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
# ─────────────────────────────────────────────────────────────────────────────

# Register sub-routers
app.include_router(forms.router)
app.include_router(questions.router)
app.include_router(public.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Typeform Clone API",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

