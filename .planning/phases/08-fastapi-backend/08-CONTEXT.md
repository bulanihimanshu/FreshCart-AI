# Phase 8: FastAPI Backend - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Building the complete Python FastAPI backend, which handles authentication for 5 demo users, routes cold start logic across 3 tiers, provides live LSTM model inferences, enables product search, and implements professor evaluation scripts.
</domain>

<decisions>
## Implementation Decisions

### Product Search Scope
- **D-01:** The `GET /api/products` string search endpoint must **only** return products that are present in the model's 5,000 item vocabulary. This prevents out-of-vocab items from entering the cart and crashing the LSTM model.

### Project Structure
- **D-02:** Use a distributed architecture with APIRouter. API logic should reside in separate files inside `backend/api/` (e.g., `auth.py`, `recommend.py`, `products.py`) to maintain a clean structure.

### State Management
- **D-03:** Load and retain precomputed lookup tables (JSON files), the vocabulary, and the `.h5` model in memory via an app-level dictionary variable using FastAPI's `lifespan` context manager.

### Professor Scripts Output
- **D-04:** Use standard plain terminal strings via `pandas` default format for the output of `run_evaluation.py` and `run_model_comparison.py`. Do not add extra UI/terminal dependencies like `rich`.

### Inherited from Prior Phases
- **D-05:** Store only `product_id` arrays in precomputed JSON files; backend hydrates full product details on startup.
- **D-06:** Deduplicate items already in the cart from recommendations.
- **D-07:** Always pad with Tier 1 global items if recommendations return fewer than 5 items.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `/.planning/ROADMAP.md` — Phase 8 definitions, PRD constraints, and acceptance criteria.
- `/.planning/REQUIREMENTS.md` — API constraints (API-01 to API-09), Auth rules (AUTH-01 to AUTH-02), and Professor scripts definitions (PROF-01 to PROF-02).

</canonical_refs>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>
