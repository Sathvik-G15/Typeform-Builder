from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import forms, questions, public, analytics

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Typeform Clone API",
    description="Backend API powering the Typeform Clone builder, respondent flow, and response analytics.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (local dev and deployed origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
