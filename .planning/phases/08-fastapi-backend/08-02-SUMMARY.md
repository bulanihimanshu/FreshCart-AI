---
phase: 08-fastapi-backend
plan: "02"
subsystem: api
tags: [fastapi, auth, session, pydantic, users]

requires:
  - phase: 08-fastapi-backend
    plan: "01"
    provides: FastAPI app with lifespan, app.state, health endpoint

provides:
  - POST /api/auth/login validating username+password against users.json, returning user info + cold-start tier
  - POST /api/auth/logout returning {"success": true}
  - backend/users.json with 5 pre-seeded demo users (Tier 1/2/3)
  - LoginRequest / UserResponse / LoginResponse / LogoutResponse Pydantic schemas

affects: [08-03-recommendations, 08-04-products, 09-react-frontend]

tech-stack:
  added: [pydantic BaseModel schemas for auth, json users store]
  patterns:
    - Stateless auth: no server-side session; frontend persists user in localStorage
    - Case-insensitive username matching
    - Password compared in plain text (demo-only, not production)
    - 401 returned for both unknown username and wrong password (avoids user enumeration)

key-files:
  created:
    - backend/api/auth.py
    - backend/users.json
  modified:
    - backend/main.py

key-decisions:
  - "Auth is stateless: server returns user record on login, frontend owns session via localStorage — consistent with PROJECT.md constraint 'no JWT, session-based demo auth'"
  - "users.json lives in backend/ (not data/) so it ships with the app without needing data pipeline to run"
  - "aisle_ids field on each user powers Tier 2 cold-start aisle affinity in Plan 08-03"

requirements-completed: [AUTH-01, AUTH-02]

duration: 1min
completed: 2026-04-17
---

# Phase 8 Plan 02: Auth Endpoints Summary

**Session-based demo auth: POST /api/auth/login validates users.json credentials and returns user info + cold-start tier; POST /api/auth/logout returns success**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-17T17:28:37Z
- **Completed:** 2026-04-17T17:29:28Z
- **Tasks:** 1 commit (3 files)
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- `backend/users.json` — 5 pre-seeded demo users with user_id, username, password (demo1234), display_name, order_count, tier (1/2/3), and aisle_ids for Tier 2 cold-start affinity
- `backend/api/auth.py` — APIRouter with `POST /api/auth/login` (validates credentials, returns `LoginResponse` with full `UserResponse`) and `POST /api/auth/logout` (stateless, returns `{"success": true}`)
- Pydantic schemas: `LoginRequest`, `UserResponse`, `LoginResponse`, `LogoutResponse`
- Auth router mounted in `backend/main.py`

## Task Commits

1. **Task 1: Auth endpoints and demo users store** — `e41bc75` (feat)

## Files Created/Modified

- `backend/api/auth.py` — auth router; login validates against users.json; logout is stateless; case-insensitive username; HTTP 401 on bad credentials
- `backend/users.json` — 5 demo users: raj_sharma (Tier 3, 18 orders), priya_mehta (Tier 3, 11 orders), arjun_nair (Tier 3, 6 orders), neha_gupta (Tier 2, 2 orders), new_user_01 (Tier 1, 0 orders); all password demo1234
- `backend/main.py` — added `from backend.api import auth` import and `app.include_router(auth.router)`

## Decisions Made

- Auth is stateless: the backend simply validates credentials and returns the user record. The frontend persists the session in localStorage. This matches the PROJECT.md constraint (no JWT, session-based demo auth is sufficient).
- `users.json` resides in `backend/` not `data/` so it ships with the codebase without requiring the data preprocessing pipeline.
- `aisle_ids` included on each user record so Plan 08-03's Tier 2 cold-start logic can use aisle affinity without re-reading CSV.
- HTTP 401 returned for both missing username and wrong password (avoids username enumeration).

## Deviations from Plan

None — plan executed exactly as described in the ROADMAP.

## Known Stubs

None — both endpoints are fully functional. Login returns real user data; logout is correctly stateless.

---
*Phase: 08-fastapi-backend*
*Completed: 2026-04-17*
