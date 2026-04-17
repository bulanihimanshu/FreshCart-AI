# Phase 7: Full Evaluation - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Running the complete 4-system comparison evaluating all models on the test set and generating visualization charts.
</domain>

<decisions>
## Implementation Decisions

### Full System Simulation
- **D-01:** Dynamically truncate the `X_test` sequences on-the-fly to simulate a 20% Tier 1, 30% Tier 2, and 50% Tier 3 distribution, arriving at a cohesive Full System blend without mutating the saved test arrays.

### Chart Presentation
- **D-02:** Group the final outputs by metric in the `metrics_comparison.png` graph, clustering Apriori vs LSTM vs LSTM+Time vs Full System side-by-side for each score to visually highlight the progression.

### Metrics Scope
- **D-03:** Evaluate HR@5, HR@10, Precision@5, and MRR. Additionally, track and chart Catalog Coverage % so the LSTM diversity is visible compared to the Apriori popularity bias.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Foundational
- `/.planning/ROADMAP.md` — Specifies ML-07
- `/.planning/REQUIREMENTS.md`
- `/FreshCart_AI_PRD_v2.md`
</canonical_refs>
