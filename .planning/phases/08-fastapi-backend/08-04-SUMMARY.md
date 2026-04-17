---
phase: "08"
plan: "04"
subsystem: fastapi-backend
tags: [cold-start, recommendation, lstm, tier-routing, fastapi]
dependency_graph:
  requires: ["08-01-PLAN.md", "08-02-PLAN.md"]
  provides: [POST /api/recommend, cold_start tier router]
  affects: [frontend recommendation panel, professor scripts]
tech_stack:
  added: []
  patterns: [3-tier cold start routing, numpy LSTM inference, aisle affinity, global top-20 padding]
key_files:
  created: []
  modified:
    - backend/core/cold_start.py
    - backend/api/recommend.py
    - backend/main.py
decisions:
  - "Final D-07 padding guarantee added in get_recommendations entry-point — pads to top_k using global_top20 when tier returns fewer results"
  - "LSTM inference uses named input dict: seq_input (1,SEQ_LEN), hour_input (1,1), dow_input (1,1), days_gap_input (1,1) normalized by /30.0"
  - "Tier 3 fallback chain: LSTM failure → Tier 2 → Tier 1 — always returns recommendations"
metrics:
  duration: "15 minutes"
  completed: "2026-04-17"
  tasks_completed: 2
  files_changed: 1
---

# Phase 08 Plan 04: Recommendation Endpoint & Cold Start Routing Summary

3-tier cold start recommendation router with LSTM inference, aisle affinity, and guaranteed padding to 5 results.

## What Was Built

### Task 1: Cold Start Logic Router (`backend/core/cold_start.py`)

The file existed from a prior executor and was nearly complete. One gap was identified and filled: the `get_recommendations` entry-point lacked a final padding guarantee at the outer function level.

**How the existing implementation satisfies acceptance criteria:**

- `def get_recommendations(` — EXISTS at line 266, public entry-point with keyword-only args
- Padding logic appending to array until `len == 5` — EXISTS in all 3 tier functions via top_k parameter and fallback chains. Added explicit final D-07 padding loop in `get_recommendations` itself to guarantee exactly `top_k` results regardless of tier outcome
- Sub-filters `cart_items` to omit duplicates — EXISTS via `cart_set = set(cart_items)` in all tier functions

**Tier implementations:**

- **Tier 1** (`_tier1_recommendations`): Pulls from `hourly_top10[hour]` → `dow_top10[dow]` → `global_top20`, excluding cart items
- **Tier 2** (`_tier2_recommendations`): Identifies cart item aisles via `products_df`, fetches `aisle_top10[aisle_id]` for each aisle, falls back to Tier 1 if insufficient
- **Tier 3** (`_tier3_recommendations`): Converts cart product IDs to vocab indices, left-pads sequence to SEQ_LEN=50, runs `model.predict({"seq_input": ..., "hour_input": ..., "dow_input": ..., "days_gap_input": ...})`, uses `np.argsort(probs)[::-1]` to select top products

**Tier classification:**
- 0 orders → Tier 1 (global popularity + time)
- 1–2 orders → Tier 2 (aisle affinity)
- 3+ orders → Tier 3 (LSTM+Time)

### Task 2: Recommend API Route (`backend/api/recommend.py`)

The file existed and fully satisfies all acceptance criteria:

- `@router.post("/recommend")` with `router = APIRouter(prefix="/api")` → resolves to `POST /api/recommend`
- Calls `get_recommendations` from `cold_start.py` (line 106)
- `backend/main.py` includes `app.include_router(recommend.router)` (line 139)

**Request schema:** `{ user_id, cart_items[], hour, dow, days_gap, top_k }`
**Response schema:** `{ recommendations: [{product_id, name, score}], tier_used }`

User's `order_count` is looked up from `app.state.users` (loaded from `users.json` at startup) to determine tier.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added final padding guarantee to get_recommendations**
- **Found during:** Task 1 review
- **Issue:** Each tier function handled its own internal fallbacks, but the `get_recommendations` outer function had no final padding step. If a tier returned fewer than `top_k` results and the internal fallbacks also exhausted, the API could return < 5 recommendations.
- **Fix:** Added an explicit padding loop after tier dispatch that fills to `top_k` using `global_top20` items not already in cart or recs (D-07 requirement).
- **Files modified:** `backend/core/cold_start.py`
- **Commit:** 5de17c0

## Known Stubs

None — all tier logic is wired to real app state data. Fallbacks are intentional safety nets, not placeholders.

## Self-Check: PASSED

- `backend/core/cold_start.py` exists and contains `def get_recommendations(`
- `backend/api/recommend.py` exists and contains `@router.post("/recommend")`
- `backend/main.py` contains `app.include_router(recommend.router)`
- Commit 5de17c0 exists
