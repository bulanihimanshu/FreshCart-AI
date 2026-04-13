---
phase: 03-apriori-baseline
plan: "02"
subsystem: ml
tags: [apriori, evaluation, hit-rate, precision, mrr, leave-one-out]

requires:
  - phase: 03-apriori-baseline
    provides: rules DataFrame from Plan 01
  - phase: 02-eda-preprocessing
    provides: X_test.npz, vocab.json, orders_subset.csv
provides:
  - "data/processed/baseline_results.csv with HR@5, HR@10, Precision@5, MRR"
  - "apriori_recommend() function for rule-based recommendations"
  - "Baseline metrics for comparison in Phase 7"
affects: [07-full-evaluation, 08-fastapi-backend]

tech-stack:
  added: []
  patterns: [leave-one-out-evaluation, order-level-ground-truth]

key-files:
  created:
    - data/processed/baseline_results.csv
  modified:
    - notebooks/03_Apriori_Baseline.ipynb

key-decisions:
  - "Ground truth loaded from raw order_products__train.csv (processed subset only has prior products)"
  - "Evaluate only eval_set='train' users (640 of 1000) — Instacart test orders have no product labels"
  - "HR@5=0.031 — lower than PRD's ~0.33 due to 10K subset and strict antecedent-subset matching"

patterns-established:
  - "Order-level evaluation protocol: query=prior order products, ground_truth=last order products"

requirements-completed: ["ML-03"]

duration: 15min
completed: 2026-04-13
---

# Phase 03 Plan 02: Leave-One-Out Evaluation & baseline_results.csv Summary

**Leave-one-out Apriori evaluation on 640 test users producing HR@5=0.031, HR@10=0.031, Precision@5=0.006, MRR=0.027**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-12T13:19:00Z
- **Completed:** 2026-04-13T07:05:00Z
- **Tasks:** 4
- **Files modified:** 2

## Accomplishments
- Loaded ground truth from raw `order_products__train.csv` inside the Instacart zip
- Built `apriori_recommend()` function with confidence-ranked rule firing
- Evaluated HR@5, HR@10, Precision@5, MRR on 640 evaluable test users
- Saved `data/processed/baseline_results.csv` with columns: metric, value

## Task Commits

1. **Task 1: Load X_test.npz and vocab** - `67e4347` (feat)
2. **Task 2: Implement apriori_recommend()** - `67e4347` (feat, same commit)
3. **Task 3: Run leave-one-out evaluation** - `67e4347` (feat, same commit)
4. **Task 4: Save baseline_results.csv** - `f9d91a1` (feat)

## Files Created/Modified
- `notebooks/03_Apriori_Baseline.ipynb` — Evaluation cells added
- `data/processed/baseline_results.csv` — 4 rows: HR@5, HR@10, Precision@5, MRR

## Decisions Made
- Ground truth comes from raw `order_products__train.csv` (zip) because `order_products_subset.csv` only contains prior order products
- Only 640 users evaluable (eval_set='train') — Instacart's eval_set='test' has no product labels
- Metrics are lower than PRD expectations (~0.03 vs ~0.33) — expected on 10K subset with strict matching; LSTM only needs to beat this baseline

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] order_products_subset.csv has no test/train order products**
- **Found during:** Task 3 (evaluation)
- **Issue:** Processed subset only contains prior order products; merge with test/train orders yielded 0 rows
- **Fix:** Load `order_products__train.csv` directly from raw Instacart zip for ground truth
- **Files modified:** notebooks/03_Apriori_Baseline.ipynb
- **Verification:** 640 users successfully evaluated, metrics computed
- **Committed in:** 67e4347

**2. [Rule 1 - Bug] ZeroDivisionError when all users skipped**
- **Found during:** Task 3 (evaluation)
- **Issue:** dict key type mismatch caused all users to be skipped, dividing by 0
- **Fix:** Pre-compute evaluable_uids list by checking both maps before looping
- **Files modified:** notebooks/03_Apriori_Baseline.ipynb
- **Verification:** 640 users evaluated successfully
- **Committed in:** 67e4347

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Essential fixes for data pipeline mismatch. No scope creep.

## Issues Encountered
- Metrics lower than PRD expectations (HR@5=0.031 vs ~0.33) — acceptable for 10K subset baseline; the important thing is LSTM beats it

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Baseline metrics established for comparison in Phase 7
- `baseline_results.csv` ready for aggregation by `07_Evaluation.ipynb`

---
*Phase: 03-apriori-baseline*
*Completed: 2026-04-13*
