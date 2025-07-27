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
    description="Your API Description",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Routers (Place these before frontend routes if you have them) ---
# e.g., app.include_router(your_api_router, prefix="/api")

# --- Frontend Serving ---

# 1. This is the only rule for static files.
# It serves everything inside the 'public' folder from the '/static' URL path.
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="static"
)

# 2. Add a route for EVERY HTML page you have.

# Route for the main index.html page
@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_index():
    return FileResponse(BASE_DIR / "public" / "index.html")

# Route for the signup.html page (mentioned in your logs)
@app.get("/signup", response_class=FileResponse, include_in_schema=False)
async def read_signup():
    return FileResponse(BASE_DIR / "public" / "signup.html")

# Add other pages here following the same pattern.
# For example, for login.html:
# @app.get("/login", response_class=FileResponse, include_in_schema=False)
# async def read_login():
#     return FileResponse(BASE_DIR / "public" / "login.html")