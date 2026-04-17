# Phase 7: Full Evaluation - Discussion Log

**Date:** 2026-04-17

## Q1: Full System Simulation
**Options Presented:**
- 1A: Force a realistic blend via random runtime truncation (20% Tier 1, 30% Tier 2, 50% Tier 3).
- 1B: Synthesize pseudo-users exclusively.
**Selected:** 1A
**Notes:** Clarified that the truncation occurs dynamically in-memory. The `.npz` files remain untouched.

## Q2: Chart Presentation
**Options Presented:**
- 2A: Grouped by metric (bars clustered).
- 2B: Grouped by system.
- 2C: Stacked bar chart.
**Selected:** 2A

## Q3: Metrics Scope
**Options Presented:**
- 3A: Stick strictly to 4 required (HR@5, HR@10, Precision@5, MRR).
- 3B: Add Coverage %.
- 3C: Add Inference Time.
**Selected:** Both 3A and 3B (Use the 4 required and add Coverage).
