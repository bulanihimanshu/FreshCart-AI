---
phase: 03-apriori-baseline
plan: "01"
subsystem: ml
tags: [apriori, mlxtend, association-rules, transaction-encoder, sparse-matrix]

requires:
  - phase: 02-eda-preprocessing
    provides: orders_subset.csv, order_products_subset.csv, vocab.json, X_test.npz
provides:
  - "03_Apriori_Baseline.ipynb with rule mining pipeline"
  - "Mined association rules (rules DataFrame) for evaluation"
affects: [03-apriori-baseline, 07-full-evaluation]

tech-stack:
  added: [mlxtend]
  patterns: [sparse-transaction-encoding, pre-filter-by-support]

key-files:
  created:
    - notebooks/03_Apriori_Baseline.ipynb
  modified: []

key-decisions:
  - "Used sparse TransactionEncoder (sparse=True) — dense 189K x 36K matrix was 6.5 GiB and OOM'd"
  - "Pre-filtered baskets to only products meeting min_support — reduces matrix from ~36K to ~1K columns"
  - "MIN_SUPPORT=0.01, MIN_CONFIDENCE=0.2 as named constants"

patterns-established:
  - "Sparse encoding pattern for large transaction matrices in mlxtend"

requirements-completed: ["ML-03"]

duration: 15min
completed: 2026-04-13
---

# Phase 03 Plan 01: Apriori Rule Mining Setup Summary

**Apriori rule mining on 189K order baskets using sparse TransactionEncoder with min_support=0.01, min_confidence=0.2**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-12T12:55:00Z
- **Completed:** 2026-04-13T07:05:00Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments
- Created `notebooks/03_Apriori_Baseline.ipynb` with full rule mining pipeline
- Built sparse one-hot transaction matrix from 189K prior order baskets
- Mined frequent itemsets and association rules with configurable thresholds
- Constants `MIN_SUPPORT=0.01`, `MIN_CONFIDENCE=0.2` defined as named constants

## Task Commits

1. **Task 1: Create notebook and imports** - `fe0c49a` (feat)
2. **Task 2: Load and filter order data** - `fe0c49a` (feat, same commit)
3. **Task 3: Build transaction matrix and mine rules** - `ed08337` (fix — sparse encoding)

## Files Created/Modified
- `notebooks/03_Apriori_Baseline.ipynb` — Full Apriori baseline notebook

## Decisions Made
- Switched to `sparse=True` in TransactionEncoder and `low_memory=True` in apriori after MemoryError on dense 6.5 GiB matrix
- Pre-filter products by min_support threshold before building matrix — products below threshold can never appear in frequent itemsets

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] MemoryError on dense transaction matrix**
- **Found during:** Task 3 (Build transaction matrix)
- **Issue:** Dense 189,462 x 36,741 bool matrix = 6.48 GiB — exceeded available RAM
- **Fix:** Used `te.fit_transform(baskets, sparse=True)` + `pd.DataFrame.sparse.from_spmatrix()` + pre-filter products by min_support threshold
- **Files modified:** notebooks/03_Apriori_Baseline.ipynb
- **Verification:** Notebook runs to completion without OOM
- **Committed in:** ed08337

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential fix for memory constraints. No scope creep.

## Issues Encountered
None beyond the MemoryError (resolved via sparse encoding).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Rule mining complete, `rules` DataFrame available for evaluation in Plan 03-02

---
*Phase: 03-apriori-baseline*
*Completed: 2026-04-13*
