from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path  # <-- 1. Import Path

# Import your route handlers
from routes import assignment_routes, health_routes

# 2. Define the absolute path to the project's root directory
BASE_DIR = Path(__file__).resolve().parent

# Initialize the FastAPI application
app = FastAPI(
    title="AI Assignment Solver API",
    description="An API to solve assignments, paraphrase answers, and generate handwritten PDFs.",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers ---
# All backend logic is prefixed with /api to avoid conflicts with frontend files.
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(assignment_routes.router, prefix="/api", tags=["Assignments"])


# --- Frontend Serving (The Fix) ---

# 3. Mount the static files directory to the root.
# This MUST be placed after all your API routes.
# `html=True` tells FastAPI to automatically serve `index.html` for "/"
app.mount("/", StaticFiles(directory=BASE_DIR / "public", html=True), name="public")

# 4. The old @app.get("/") route handler has been removed as it is no longer needed.
# The StaticFiles mount now handles serving your index.html file.
