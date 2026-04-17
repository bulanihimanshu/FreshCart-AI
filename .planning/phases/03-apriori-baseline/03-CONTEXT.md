# Phase 03: Apriori Baseline - Context

**Gathered:** 2026-04-12
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the Apriori association rule baseline — the benchmark that all subsequent LSTM models will be measured against. It covers:

1. **Rule Mining:** Install mlxtend, build a one-hot transaction matrix (order-level), mine association rules with fixed thresholds.
2. **Evaluation:** Compute HR@5, HR@10, Precision@5, and MRR on the 1,000 held-out test users using leave-one-out protocol; save `baseline_results.csv`.
3. **Limitation Narrative:** Write a narrative markdown section documenting Apriori's 5 limitations in own words, and how each is addressed by the LSTM.

</domain>

<decisions>
## Implementation Decisions

### Apriori Hyperparameters
- **D-01:** `min_support=0.01, min_confidence=0.2` — fixed values (not configurable via CLI). Defined as named constants at the top of the notebook for easy tweaking. Provides balanced rule coverage without blowing up runtime on Colab free tier or local laptop.

### Transaction Definition
- **D-02:** **Order-level transactions** — one transaction = one order's basket of items (not per-user history). Each of the ~200K prior orders in `order_products_subset.csv` becomes one row in the transaction matrix. This is the canonical market basket analysis formulation and the most defensible approach for the university report.

### Evaluation Methodology
- **D-03:** **Leave-one-out on test users' last order.** For each of the 1,000 test users (`X_test.npz`):
  - Ground truth = the items in their last chronological order
  - Query = the items from their second-to-last order (what they "already have")
  - Recommendation = top-K rule consequents that fire on the query items
  - HR@K = fraction of 1,000 users with ≥1 hit in top-K
  - This protocol is identical to how the LSTM will be evaluated in Phase 7, ensuring fair comparison. Expected HR@5 ≈ 0.33 per PRD.

### Limitation Narrative
- **D-04:** Write a **narrative explanation in own words** — 3-4 sentences per limitation (not a verbatim table copy). Each paragraph explains the limitation in plain language AND connects it to what the LSTM does differently. This reads as original analysis for the university report. The 5 limitations from PRD §1.2 must all be covered: (1) ignores item order, (2) ignores time, (3) no personalization, (4) cold start failure, (5) no session modeling.

### Agent's Discretion
- Metrics to compute: HR@5, HR@10, Precision@5, MRR — exact definitions follow standard IR conventions (HR = recall at K, Precision = hits/K, MRR = mean reciprocal rank of first hit).
- Output format for `baseline_results.csv`: one row per metric, columns `[metric, value]` — consistent with what Phase 7 will aggregate.
- mlxtend version: latest compatible with the project's Python 3.12 environment.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Specs
- `.planning/REQUIREMENTS.md` §ML-03 — Core requirement for the Apriori notebook
- `FreshCart_AI_PRD_v2.md` §1.2 — 5 Apriori limitations (must all appear in narrative)
- `FreshCart_AI_PRD_v2.md` §12.3 — Expected metric values (HR@5 ≈ 0.33, HR@10 ≈ 0.46)

### Data Inputs (from Phase 2)
- `data/processed/orders_subset.csv` — columns: order_id, user_id, eval_set, order_number, order_dow, order_hour_of_day, days_since_prior_order
- `data/processed/order_products_subset.csv` — columns: order_id, product_id, add_to_cart_order, reordered
- `data/processed/X_test.npz` — 1,000 test users, sequences shape (1000, 100), int32
- `data/processed/vocab.json` — product_id → index mapping (5,001 entries, PAD=0)

### Prior Phase Context
- `.planning/phases/02-eda-preprocessing/02-CONTEXT.md` — vocabulary and split decisions that give the evaluation its ground truth

</canonical_refs>
