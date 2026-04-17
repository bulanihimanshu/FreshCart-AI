# Phase 6: Cold Start System - Context

**Gathered:** 2026-04-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Building the 3-tier cold start routing logic and pre-computing lookup tables that power Tiers 1 and 2 — enabling recommendations for users with zero or minimal order history.
</domain>

<decisions>
## Implementation Decisions

### JSON Data Richness
- **D-01:** Store only `product_id` arrays in the precomputed JSON files to keep them lightweight. The backend will hydrate full product details (e.g., from `products.csv`) on startup when serving recommendations.

### Tier 2 Deduplication (Aisle-Affinity)
- **D-02:** When serving Tier 2 aisle-affinity recommendations, return the absolute top items for the user's top aisle, but filter out anything currently present in their cart (while still allowing past purchases).

### Fallback Strategy
- **D-03:** Always pad with Tier 1 (Global Top 20) items if Tier 2 or Tier 3 logic doesn't return enough items (i.e. < 5). This ensures the UI is consistently filled with 5 recommendations.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specifications
- `/.planning/ROADMAP.md` — Phase 6 definitions and acceptance criteria
- `/FreshCart_AI_PRD_v2.md` — Contains core project constraints, requirements, and cold start specifications.
</canonical_refs>
