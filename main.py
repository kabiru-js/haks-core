from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path  # 1. Import the Path library

# Import your route handlers
from routes import assignment_routes, health_routes

# 2. Define the project's base directory
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

# --- Frontend Serving ---

# 3. Mount the 'public' directory using an absolute path
# This ensures FastAPI can find it regardless of the server's working directory.
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="public_assets"
)

# This special route handles the root path "/" to serve your landing page.
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_landing_page():
    # 4. Use an absolute path here as well for consistency
    return FileResponse(BASE_DIR / 'public' / 'index.html')
