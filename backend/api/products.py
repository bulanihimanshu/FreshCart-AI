"""
FreshCart AI — /api/products endpoints

GET /api/products?query=<str>&limit=<int>
  Returns products whose names contain *query* (case-insensitive).
  Results are filtered to only items present in the model vocabulary (D-01)
  to prevent out-of-vocabulary product IDs from reaching the LSTM.

GET /api/products/{id}
  Returns full details for a single product, or 404 if not found.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["products"])


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class ProductItem(BaseModel):
    product_id: int
    name: str
    aisle: str
    department: str
    aisle_id: int
    department_id: int


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/products", response_model=list[ProductItem])
async def search_products(
    request: Request,
    query: str = Query(..., min_length=1, description="Substring to search in product names"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of results to return"),
):
    """
    Search for products by name substring.

    Only products present in the model vocabulary (``app.state.vocab``) are
    returned (D-01). This guarantees every returned ``product_id`` can be
    safely passed to the LSTM without triggering an out-of-vocabulary error.
    """
    products_df: dict = getattr(request.app.state, "products_df", {})
    vocab: dict = getattr(request.app.state, "vocab", {})

    query_lower = query.lower()
    results: list[ProductItem] = []

    for product_id, details in products_df.items():
        # Vocabulary check — vocab keys are string product_ids (D-01)
        if str(product_id) not in vocab:
            continue

        if query_lower not in details["name"].lower():
            continue

        results.append(
            ProductItem(
                product_id=product_id,
                name=details["name"],
                aisle=details.get("aisle", ""),
                department=details.get("department", ""),
                aisle_id=details.get("aisle_id", 0),
                department_id=details.get("department_id", 0),
            )
        )

        if len(results) >= limit:
            break

    logger.info(
        "GET /api/products  query=%r  vocab_size=%d  returned=%d",
        query,
        len(vocab),
        len(results),
    )

    return results


@router.get("/products/{id}", response_model=ProductItem)
async def get_product(id: int, request: Request):
    """
    Return full details for a single product by its numeric ID.

    Returns HTTP 404 if the product ID is not found in the products lookup.
    """
    products_df: dict = getattr(request.app.state, "products_df", {})

    details = products_df.get(id)
    if details is None:
        raise HTTPException(status_code=404, detail=f"Product {id} not found.")

    return ProductItem(
        product_id=id,
        name=details["name"],
        aisle=details.get("aisle", ""),
        department=details.get("department", ""),
        aisle_id=details.get("aisle_id", 0),
        department_id=details.get("department_id", 0),
    )
