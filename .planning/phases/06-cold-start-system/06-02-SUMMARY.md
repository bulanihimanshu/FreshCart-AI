---
phase: 06-cold-start-system
plan: 02
status: complete
updated: 2026-04-17
key-files:
  created: []
  modified:
    - notebooks/06_Cold_Start.ipynb
---

## What was built
Implemented the core 3-tier cold start routing logic inside `06_Cold_Start.ipynb`: `get_user_tier`, `recommend_tier1`, `recommend_tier2`, `recommend_tier3`, and the unified `get_recommendations` function. Connected the router to the previously saved `lstm_time_model.keras`.

## Key decisions
- **Filter cart items (D-02)**: Ensured Tier 2 logic excludes any products currently active in the user's cart while still allowing them to re-buy past favorites.
- **Always Pad with Tier 1 (D-03)**: If any tier returns less than requested (`n=5`) products (due to missing data, short history, or cart exclusions), it automatically appends globally popular products from Tier 1 to guarantee a robust UI experience.
- **Aisle map global**: Pre-built `product_aisles` map so functions are clean and easily portable to FastAPI backend in Phase 8.

## Dependencies satisfied
- Fulfills foundational cold start recommendations fallback rules (ML-06).

## Self-Check: PASS
The unified router correctly routes to the assigned tier based on `order_count`. Cart items are properly omitted from recommendations. All tiers pad their outputs to return precisely `n=5` items as instructed.
