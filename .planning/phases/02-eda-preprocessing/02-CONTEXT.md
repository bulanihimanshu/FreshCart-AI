# Phase 02: EDA & Preprocessing - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the foundational data analysis and preparation for machine learning. This includes:
1. **Exploratory Data Analysis (EDA):** Visualizing distributions, patterns, and reorder rates in the sampled Instacart subset.
2. **Preprocessing (Sequences & Vocab):** Converting per-user orders into integer sequences for the LSTM, creating a fixed-size vocabulary of 5,000 items.
3. **Data Splitting:** Creating stratified train/val/test splits (user-based) so model evaluation is meaningful.

</domain>

<decisions>
## Implementation Decisions

### EDA & Visualizations
- **D-01:** the agent's Discretion. The EDA notebook will include charts for Order Distribution, Time Heatmaps (Hour/DOW), Top 20 Products, Reorder Rates, and Sequence Length Distribution.

### Preprocessing (Sequences)
- **D-02:** Full sequences will be used (no sliding window). To maintain model efficiency on Colab T4, sequences will be capped at a sensible maximum length (e.g., 100) and padded.

### Vocabulary
- **D-03:** The top 5,000 products by **Total Frequency** will be selected for the vocabulary (plus 1 padding token, total 5,001).

### Data Splitting
- **D-04:** Data will be split using an **80/10/10** ratio (Train/Val/Test), stratified by user to ensure no data leakage.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Specs
- `.planning/REQUIREMENTS.md` §ML-01, ML-02, DATA-02 — Core logic for EDA and Preprocessing.
- `.planning/PROJECT.md` §Context — Defines the 10K user subset and vocabulary constraints.

### Data
- `data/processed/` — Output directory for sampled CSVs from Phase 1.
- `scripts/sampling.py` — The script used to generate the source data for this phase.

</canonical_refs>
