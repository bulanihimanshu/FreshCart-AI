"""
FreshCart AI — Authentication Endpoints

POST /api/auth/login   — validate username/password against users.json; return user info + tier
POST /api/auth/logout  — return {"success": true}
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ---------------------------------------------------------------------------
# Path to the users store — resolved relative to this file's package root
# ---------------------------------------------------------------------------
USERS_PATH = Path(__file__).resolve().parent.parent / "users.json"


def _load_users() -> list[dict[str, Any]]:
    """Load the users list from users.json on disk."""
    if not USERS_PATH.exists():
        logger.error("users.json not found at %s", USERS_PATH)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User store not available.",
        )
    with USERS_PATH.open() as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    user_id: int
    username: str
    display_name: str
    order_count: int
    tier: int
    aisle_ids: list[int]


class LoginResponse(BaseModel):
    success: bool
    user: UserResponse


class LogoutResponse(BaseModel):
    success: bool


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest) -> LoginResponse:
    """
    Authenticate a demo user.

    Returns HTTP 401 if the username doesn't exist or the password is wrong.
    Returns HTTP 200 with the user record (including cold-start tier) on success.
    """
    users = _load_users()

    # Case-insensitive username match
    user = next(
        (u for u in users if u["username"].lower() == body.username.lower()),
        None,
    )

    if user is None or user["password"] != body.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    logger.info(
        "Login: user_id=%d username=%s tier=%d",
        user["user_id"],
        user["username"],
        user["tier"],
    )

    return LoginResponse(
        success=True,
        user=UserResponse(
            user_id=user["user_id"],
            username=user["username"],
            display_name=user["display_name"],
            order_count=user["order_count"],
            tier=user["tier"],
            aisle_ids=user.get("aisle_ids", []),
        ),
    )


@router.post("/logout", response_model=LogoutResponse)
async def logout() -> LogoutResponse:
    """
    Logout the current session.

    The backend is stateless; this endpoint exists so the frontend can call a
    symmetric logout route and clear its own session storage.
    """
    return LogoutResponse(success=True)
