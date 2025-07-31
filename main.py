from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

# Assuming your routes are in a 'routes' folder
# from routes import assignment_routes, health_routes

# --- Setup: Define Base Directory ---
BASE_DIR = Path(__file__).resolve().parent

# --- Initialize FastAPI App ---
app = FastAPI(
    title="Haks API",
    description="Your API Description",
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

# --- API Routers (These come first) ---
# app.include_router(health_routes.router, prefix="/api", tags=["Health"])
# app.include_router(assignment_routes.router, prefix="/api", tags=["Assignments"])

# --- Frontend Serving ---

# 1. Mount the 'public' directory to serve all static files (CSS, JS, images)
#    This one rule handles styles.css, login.css, signup.css, script.js, etc.
app.mount(
    "/static",
    StaticFiles(directory=BASE_DIR / "public"),
    name="static"
)

# 2. Add routes for ALL your HTML pages

@app.get("/", response_class=FileResponse, include_in_schema=False)
async def read_index():
    return FileResponse(BASE_DIR / "public" / "index.html")

@app.get("/login", response_class=FileResponse, include_in_schema=False)
async def read_login():
    return FileResponse(BASE_DIR / "public" / "login.html")

# --- THIS IS THE NEW ROUTE YOU NEED ---
# It tells the server what to do when someone visits /signup
@app.get("/signup", response_class=FileResponse, include_in_schema=False)
async def read_signup():
    return FileResponse(BASE_DIR / "public" / "signup.html")

# Note: In your previous files, you had links to 'register.html'.
# If you have renamed that file to 'signup.html', you should remove the old
# @app.get("/register") route to avoid confusion.

# --- Optional but recommended routes for your new links ---
# Your signup page links to /terms and /privacy. If you create those pages,
# you will need to add routes for them like this:
#
# @app.get("/terms", response_class=FileResponse, include_in_schema=False)
# async def read_terms():
#     return FileResponse(BASE_DIR / "public" / "terms.html")
#
# @app.get("/privacy", response_class=FileResponse, include_in_schema=False)
# async def read_privacy():
#     return FileResponse(BASE_DIR / "public" / "privacy.html")