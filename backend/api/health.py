"""Health check endpoint for FreshCart AI backend."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/api/health")
async def health_check() -> dict:
    """Return a simple liveness signal for load balancers and dev tooling."""
    return {"status": "ok"}
