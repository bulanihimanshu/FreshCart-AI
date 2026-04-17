---
phase: 08-fastapi-backend
plan: "03"
subsystem: api
tags: [fastapi, lstm, cold-start, recommendations, python]

requires:
  - phase: 08-01
    provides: FastAPI app core, app.state with LSTM model and precomputed tables
  - phase: 06-cold-start-system
    provides: precomputed lookup tables (global_top20, hourly_top10, dow_top10, aisle_top10)
  - phase: 05-time-aware-lstm
    provides: lstm_time_model.keras, vocab.json

provides:
  - POST /api/recommend endpoint
  - backend/core/cold_start.py — 3-tier cold start router
  - backend/users.json — 5 demo users with tier assignments
  - app.state.users loaded at startup for O(1) user tier lookup

affects: [08-02-auth, 08-04-products, 08-05-professor-scripts, 09-react-frontend]

tech-stack:
  added: []
  patterns:
    - Cold start tier routing: get_user_tier(order_count) -> 1/2/3
    - Tier 1: hourly_top10 -> dow_top10 -> global_top20 cascade
    - Tier 2: aisle-affinity from cart items, falls back to Tier 1
    - Tier 3: LSTM+Time predict() with graceful fallback chain to Tier 2 -> Tier 1
    - Users loaded into app.state at lifespan startup (not per-request file read)

key-files:
  created:
    - backend/core/cold_start.py
    - backend/api/recommend.py
    - backend/users.json
  modified:
    - backend/main.py

key-decisions:
  - "Users loaded into app.state at startup (not per-request file reads) for performance"
  - "Tier 3 LSTM inference has graceful fallback to Tier 2, then Tier 1 on any error"
  - "Sequence padding strategy: left-pad to SEQ_LEN=50 with zeros, truncate oldest items"
  - "days_gap normalized by /30.0 consistent with Phase 5 training preprocessing (D-02)"

requirements-completed: [API-03]

duration: 2min
completed: 2026-04-17
---

# Phase 8 Plan 03: Recommend Endpoint Summary

**POST /api/recommend with 3-tier cold start router: Tier 1 (global popularity), Tier 2 (aisle-affinity), Tier 3 (LSTM+Time inference) with graceful fallback chain**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-17T17:32:34Z
- **Completed:** 2026-04-17T17:37:09Z
- **Tasks:** 4
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments

- `backend/core/cold_start.py` — full 3-tier cold start router with `get_user_tier()`, `_tier1_recommendations()`, `_tier2_recommendations()`, `_tier3_recommendations()`, and `get_recommendations()` public entry-point
- `backend/api/recommend.py` — `POST /api/recommend` endpoint with Pydantic request/response schemas, user tier resolution from `app.state.users`, returns `{recommendations, tier_used}`
- `backend/users.json` — 5 pre-seeded demo users: raj_sharma (T3), priya_mehta (T3), arjun_nair (T3), neha_gupta (T2), new_user_01 (T1)
- `backend/main.py` updated — recommend router registered, users.json loaded into `app.state.users` during lifespan startup

## Task Commits

1. **Task 1: cold_start.py 3-tier router** - `0d32328` (feat)
2. **Task 2: users.json 5 demo users** - `56f4055` (feat)
3. **Task 3: POST /api/recommend endpoint** - `5fd07ff` (feat)
4. **Task 4: Register router + lifespan users loading** - `f32e04b` (feat)

## Files Created/Modified

- `backend/core/cold_start.py` — Tier 1/2/3 recommendation functions; `get_recommendations()` routes by order_count; Tier 3 uses LSTM model predict() with left-padded sequence; graceful fallback chain throughout
- `backend/api/recommend.py` — FastAPI endpoint with `RecommendRequest` / `RecommendResponse` Pydantic models; resolves order_count from `app.state.users`; delegates all recommendation logic to cold_start module
- `backend/users.json` — 5 demo users with user_id, username, password, display_name, order_count, tier fields
- `backend/main.py` — added `recommend` router import and `app.include_router(recommend.router)`; added USERS_PATH constant; added users.json loading step 5 in lifespan

## Decisions Made

- `app.state.users` preloaded at startup: avoids repeated file I/O for a 5-user demo app; consistent with the established lifespan loading pattern from 08-01
- Tier 3 LSTM sequence input: left-pad to SEQ_LEN=50 (matches training preprocessing), truncate oldest items if cart > 50, use index 0 for unknown products/padding
- `days_gap` normalized by `/30.0` in Tier 3 — consistent with Phase 5 decision D-02 recorded in STATE.md
- Graceful fallback chain: Tier 3 fails → Tier 2, Tier 2 empty → Tier 1 — ensures users always receive recommendations even when ML artifacts are missing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] Loaded users.json into app.state at startup**
- **Found during:** Task 3 (creating recommend.py)
- **Issue:** Original design would read users.json from disk on every POST /api/recommend request — unnecessary I/O for a 5-user file that never changes at runtime
- **Fix:** Added USERS_PATH constant and step 5 to the lifespan context manager in main.py to preload users into app.state.users; recommend.py reads from app.state instead of disk
- **Files modified:** `backend/main.py`, `backend/api/recommend.py`
- **Commit:** `f32e04b` (Task 4 commit)

---

**Total deviations:** 1 auto-fixed (1 missing optimization — Rule 2)
**Impact on plan:** Minor enhancement — no behavior change, just avoids repeated file reads at runtime.

## Issues Encountered

None — all tasks completed cleanly.

## Known Stubs

None — cold_start.py uses real logic (no hardcoded empty returns). When LSTM model is not loaded (missing .keras file) or inference fails, the system gracefully degrades to Tier 2 → Tier 1, which are real precomputed-table lookups. The precomputed tables (global_top20.json, etc.) will be populated by the Phase 6 notebook; until then, the endpoint returns empty recommendations rather than crashing.

## Next Phase Readiness

- Plan 08-04 (products + user endpoints) can be added as new routers following the same pattern
- Plan 08-02 (auth endpoints) can use `app.state.users` (already populated) for credential validation — no additional loading needed
- Frontend can now POST to `/api/recommend` with `{user_id, cart_items, hour, dow, days_gap}` and receive `{recommendations, tier_used}`

## Self-Check: PASSED

- backend/core/cold_start.py: FOUND
- backend/api/recommend.py: FOUND
- backend/users.json: FOUND
- 08-03-SUMMARY.md: FOUND
- commit 0d32328: FOUND
- commit 56f4055: FOUND
- commit 5fd07ff: FOUND
- commit f32e04b: FOUND

---
*Phase: 08-fastapi-backend*
*Completed: 2026-04-17*
