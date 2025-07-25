from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse  # Import FileResponse

# Import your route handlers
from routes import assignment_routes, health_routes

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

# This MUST be the last part of your app's setup.
# It mounts the 'public' directory. Any request that doesn't match an API route
# will be looked for here. This will serve /app.html, /script.js, /style.css etc.
app.mount("/static", StaticFiles(directory="public"), name="public_assets")

# This special route handles the root path "/" to serve your landing page.
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_landing_page():
    return FileResponse('public/index.html')
