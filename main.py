from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

# Import your route handlers
from routes import assignment_routes, health_routes

# --- Setup: Define Base Directory ---
# This creates an absolute path to ensure your files are found on Render's server
BASE_DIR = Path(__file__).resolve().parent

# --- Initialize FastAPI App ---
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

# --- API Routers (These must come BEFORE the frontend mount) ---
# Your API logic is matched first, so requests to /api/... are handled here.
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(assignment_routes.router, prefix="/api", tags=["Assignments"])


# --- Frontend Serving (This must be the LAST thing in the file) ---
# This single line handles serving all your frontend files.
# It's a "catch-all" that looks for files in your 'public' directory.
app.mount(
    "/",
    StaticFiles(directory=BASE_DIR / "public", html=True),
    name="public"
)
