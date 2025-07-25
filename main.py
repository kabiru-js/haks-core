from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse # Add JSONResponse
from pathlib import Path
import os # Add the os module

# Assuming your routes are in a 'routes' folder
from routes import assignment_routes, health_routes

# --- Setup: Define Base Directory ---
BASE_DIR = Path(__file__).resolve().parent

# --- Initialize FastAPI App ---
app = FastAPI(
    title="Haks API",
    # ... your other app settings ...
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    # ... your CORS settings ...
)

# --- API Routers (These come first) ---
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(assignment_routes.router, prefix="/api", tags=["Assignments"])

# --- Frontend Serving ---

# 1. Mount the 'public' directory
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="static"
)

# 2. Add routes for ALL your HTML pages
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_index():
    return FileResponse(BASE_DIR / "public" / "index.html")

# --- Add your other HTML routes here (/login, /register, etc.) ---
@app.get("/login", response_class=FileResponse, include_in_schema=False)
async def read_login():
    return FileResponse(BASE_DIR / "public" / "login.html")

# ... add all the others you need ...


# --- !! TEMPORARY DEBUGGING ROUTE !! ---
@app.get("/debug-paths", response_class=JSONResponse, include_in_schema=False)
def debug_paths():
    """
    This route helps us see what the server sees.
    """
    public_dir_path = BASE_DIR / "public"
    css_file_path = public_dir_path / "styles.css"
    
    return {
        "base_directory": str(BASE_DIR),
        "public_folder_path": str(public_dir_path),
        "css_file_path": str(css_file_path),
        "public_folder_exists": public_dir_path.exists(),
        "css_file_exists": css_file_path.exists(),
        "files_in_public_folder": [f for f in public_dir_path.iterdir()] if public_dir_path.exists() else "Folder not found"
    }
