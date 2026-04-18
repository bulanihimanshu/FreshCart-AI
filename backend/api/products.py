"""
FreshCart AI — /api/products endpoints

GET /api/products?query=<str>&limit=<int>
  Returns products whose names contain *query* (case-insensitive).
  When query is empty, returns popular in-vocabulary products up to limit.
  Results are filtered to only items present in the model vocabulary (D-01).

GET /api/products/{id}
  Returns full details for a single product, or 404 if not found.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["products"])


class ProductItem(BaseModel):
    product_id: int
    product_name: str
    name: str
    aisle: str
    department: str
    aisle_id: int
    department_id: int


@router.get("/products", response_model=list[ProductItem])
async def search_products(
    request: Request,
    query: str = Query(default='', description="Substring to search in product names (empty = return popular items)"),
    limit: int = Query(20, ge=1, le=100, description="Maximum number of results to return"),
):
    """
    Search for products by name substring.

    When query is empty, returns the first `limit` in-vocabulary products.
    Only products present in the model vocabulary (``app.state.vocab``) are
    returned (D-01).
    """
    products_df: dict = getattr(request.app.state, "products_df", {})
    vocab: dict = getattr(request.app.state, "vocab", {})

    query_lower = query.lower().strip()
    results: list[ProductItem] = []

    for product_id, details in products_df.items():
        if str(product_id) not in vocab:
            continue

        if query_lower and query_lower not in details["name"].lower():
            continue

        results.append(
            ProductItem(
                product_id=product_id,
                product_name=details["name"],
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
    """Return full details for a single product by its numeric ID."""
    products_df: dict = getattr(request.app.state, "products_df", {})

    details = products_df.get(id)
    if details is None:
        raise HTTPException(status_code=404, detail=f"Product {id} not found.")

    return ProductItem(
        product_id=id,
        product_name=details["name"],
        name=details["name"],
        aisle=details.get("aisle", ""),
        department=details.get("department", ""),
        aisle_id=details.get("aisle_id", 0),
        department_id=details.get("department_id", 0),
    )
