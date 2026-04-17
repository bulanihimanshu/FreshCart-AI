# Phase 1: Data Foundation - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Set up the project folder structure, dependencies, and environment configuration. Extract and sample the Instacart dataset to produce a high-quality 10K user subset for sequential model training.

</domain>

<decisions>
## Implementation Decisions

### Sampling Strategy
- **D-01:** The agent chooses the sampling strategy. To ensure the sequential LSTM has enough data to learn user patterns, sampling will prioritize "active" users (e.g., those with at least 5-10 prior orders) rather than pure random sampling of the 10K subset.

### Project Structure & Boilerplate
- **D-02:** Backend and frontend main directories will be created as empty folders (no "Hello World" boilerplate).
- **D-03:** The full sub-folder skeleton specified in the PRD (Sections 5 & 6) will be scaffolded immediately during this phase to establish the architecture.
- **D-04:** Folder naming will strictly follow the PRD: `backend/`, `frontend/`, `data/`, `notebooks/`, `scripts/`, `professor_scripts/`.

### Dataset & Environment
- **D-05:** The `instacart datset.zip` file will be moved to `data/raw/` for extraction rather than staying in the project root.
- **D-06:** `data/processed/` and `data/raw/` will be added to `.gitignore`.

### the agent's Discretion
- Exact minimum order threshold for sampling (aiming for balanced 10K subset).
- Standard `.gitignore` content for Python and React environments.
- Python package versions in `requirements.txt` (targeting stable 2025/2026 versions).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Spec
- `FreshCart_AI_PRD_v2.md` — Core requirements, implementation timeline, and user context.
- `.planning/PROJECT.md` — High-level goals and ML innovation descriptions.

### Architecture Layout
- `FreshCart_AI_PRD_v2.md` §5 — Frontend component and file structure.
- `FreshCart_AI_PRD_v2.md` §6 — Backend endpoint and file structure.
- `FreshCart_AI_PRD_v2.md` §10 — Overall project folder structure spec.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None (Greenfield project).

### Integration Points
- Primary integration point is the raw ZIP file `instacart datset.zip` currently in the root.

</code_context>

<deferred>
## Deferred Ideas
- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-data-foundation*
*Context gathered: 2026-04-11*
