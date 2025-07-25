from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# --- API Routers ---
# These are matched first. All your backend logic lives here.
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(assignment_routes.router, prefix="/api", tags=["Assignments"])


# --- Frontend Serving ---
# This section handles serving your HTML pages and static assets.

# 1. Mount the 'public' directory to serve static files (CSS, JS, images)
#    Any request starting with /static will be looked for in the 'public' folder.
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="public"
)

# 2. Add a route for the main landing page (index.html)
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_landing_page():
    return FileResponse(BASE_DIR / "public" / "index.html")

# 3. Add a specific route for your login page (login.html)
@app.get("/login", response_class=FileResponse, include_in_schema=False)
async def read_login_page():
    return FileResponse(BASE_DIR / "public" / "login.html")

# --- Add more page routes here as needed ---
# For example, if you have a pricing.html, you would add:
# @app.get("/pricing", response_class=FileResponse, include_in_schema=False)
# async def read_pricing_page():
#     return FileResponse(BASE_DIR / "public" / "pricing.html")
