"""
FreshCart AI — /api/recommend endpoint

POST /api/recommend
  Request body: { user_id, cart_items, hour, dow, days_gap }
  Response:     { recommendations: [{product_id, name, score}], tier_used }

Delegates to ``backend.core.cold_start.get_recommendations`` which routes
the request to the correct cold-start tier based on the user's order count.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field

from backend.core.cold_start import get_recommendations

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["recommend"])


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class RecommendRequest(BaseModel):
    user_id: int = Field(..., description="Authenticated user's numeric ID")
    cart_items: list[int] = Field(
        default_factory=list,
        description="List of product_id integers currently in the cart",
    )
    hour: int = Field(
        default=12,
        ge=0,
        le=23,
        description="Current hour of day (0–23)",
    )
    dow: int = Field(
        default=0,
        ge=0,
        le=6,
        description="Current day of week (0=Monday … 6=Sunday)",
    )
    days_gap: float = Field(
        default=7.0,
        ge=0.0,
        description="Days since the user's last order",
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Number of recommendations to return (default 5, max 20)",
    )


class RecommendationItem(BaseModel):
    product_id: int
    name: str
    score: float | None = None


class RecommendResponse(BaseModel):
    recommendations: list[RecommendationItem]
    tier_used: int


# ---------------------------------------------------------------------------
# User lookup helpers
# ---------------------------------------------------------------------------

def _get_user_order_count(user_id: int, users: list[dict]) -> int:
    """
    Return the historical order count for *user_id* from the preloaded users list.

    Raises HTTP 404 if the user is not found.
    """
    for user in users:
        if user.get("user_id") == user_id:
            return int(user.get("order_count", 0))

    raise HTTPException(status_code=404, detail=f"User {user_id} not found.")


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(payload: RecommendRequest, request: Request):
    """
    Return top-K product recommendations for the given user and cart context.

    The cold-start tier is determined by the user's historical order count:
      - Tier 1 (0 orders):   global popularity + time-based
      - Tier 2 (1–2 orders): aisle-affinity recommendations
      - Tier 3 (3+ orders):  LSTM+Time personalised recommendations
    """
    users: list[dict] = getattr(request.app.state, "users", [])
    order_count = _get_user_order_count(payload.user_id, users)

    recs, tier_used = get_recommendations(
        app_state=request.app.state,
        order_count=order_count,
        cart_items=payload.cart_items,
        hour=payload.hour,
        dow=payload.dow,
        days_gap=payload.days_gap,
        top_k=payload.top_k,
    )

    logger.info(
        "POST /api/recommend  user_id=%d  tier=%d  returned=%d items",
        payload.user_id,
        tier_used,
        len(recs),
    )

    return RecommendResponse(
        recommendations=[RecommendationItem(**r) for r in recs],
        tier_used=tier_used,
    )
