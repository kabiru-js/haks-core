from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers (These come first) ---
# app.include_router(...) # Add your API routers here if you have them

# --- Frontend Serving ---

# 1. THIS IS THE ONLY RULE FOR STATIC FILES.
# It tells FastAPI to serve the 'public' folder at the '/static' URL.
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="static"
)

# 2. Add routes for ALL your HTML pages
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_index():
    return FileResponse(BASE_DIR / "public" / "index.html")

# Add other pages if you have them, for example:
# @app.get("/login", response_class=FileResponse, include_in_schema=False)
# async def read_login():
#     return FileResponse(BASE_DIR / "public" / "login.html")