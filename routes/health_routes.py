# routes/health_routes.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/health-check")
async def health_check():
    """Confirms the server is running."""
    return {"status": "ok"}