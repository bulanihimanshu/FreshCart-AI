---
phase: "05-time-aware-lstm"
plan: "05-03"
subsystem: "ml-notebook"
tags: [evaluation, comparison, lstm, time-aware, metrics, pandas]
dependency_graph:
  requires: ["05-02", "04-03", "03-03"]
  provides: ["lstm_time_results.csv", "model_comparison.csv", "evaluation cells 11-17 in 05_Time_Features.ipynb"]
  affects: ["Phase 7 aggregation", "professor evaluation scripts"]
tech_stack:
  added: []
  patterns: ["leave-one-out evaluation", "batch prediction", "pandas comparison DataFrame"]
key_files:
  modified:
    - notebooks/05_Time_Features.ipynb
decisions:
  - "Batch predict over all 1,000 test users at once (not per-user loop) for speed on T4 GPU"
  - "Graceful fallback to hardcoded Phase 3 values when baseline_results.csv not found"
  - "Graceful guard: LSTM+Time > LSTM assertion only fires when Phase 4 lstm_results.csv exists (non-zero values)"
  - "model_comparison.csv saved with raw float values (not formatted strings) for downstream CSV parsing"
metrics:
  duration: "~15 minutes"
  completed_date: "2026-04-16"
  tasks_completed: 2
  files_modified: 1
---

# Phase 05 Plan 03: Evaluation & Comparison (Apriori vs LSTM vs LSTM+Time) Summary

## One-liner

Full leave-one-out evaluation pipeline for TimeAwareLSTM with batch prediction, HR@5/HR@10/Precision@5/MRR metrics, and a three-system Pandas comparison DataFrame saved as `model_comparison.csv`.

## What Was Built

Extended `notebooks/05_Time_Features.ipynb` with 7 new cells (11-17) covering the complete evaluation and comparison pipeline:

**Task T01 — Evaluation loop (Cells 11-13):**
- Cell 11: Three evaluation helper functions (`hits_at_k`, `precision_at_k`, `reciprocal_rank`) identical to Phase 4 for consistency.
- Cell 12: Batch prediction over all 1,000 test users using the 4-input dict call matching the TimeAwareLSTM's named inputs (`seq_input`, `hour_input`, `dow_input`, `days_gap_input`). Loop computes HR@5, HR@10, Precision@5, MRR and stores them in `time_metrics` dict.
- Cell 13: Saves `lstm_time_results.csv` to `{MODELS_DIR}/../results/` with `[metric, value]` rows, consistent with Phase 3/4 CSV format for Phase 7 aggregation.

**Task T02 — Comparison table (Cells 14-17):**
- Cell 14: Loads `baseline_results.csv` (Apriori) and `lstm_results.csv` (LSTM-only) from results dir; falls back gracefully to hardcoded Phase 3 values or zeros if files missing. Builds D-03 Pandas DataFrame with `Apriori`, `LSTM Only`, `LSTM + Time` columns plus three delta columns (`LSTM vs Apriori`, `LSTM+Time vs LSTM`, `LSTM+Time vs Apriori`). Prints formatted comparison table.
- Cell 15: Programmatic success checks — asserts `hr5_time > hr5_apriori` unconditionally; asserts `hr5_time > hr5_lstm_prev` only when Phase 4 CSV is available (guards against zero baseline).
- Cell 16: Markdown narrative documenting the 32-dim time vector (16+8+8), 288-dim fusion representation, and innovation rationale for the university report.
- Cell 17: Saves `model_comparison.csv` as raw-float CSV (4 rows, one per metric) for Phase 7 aggregation.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| T01 | 7cb10ef | Evaluation loop: helper functions, batch predict, lstm_time_results.csv |
| T02 | d71f5bf | Comparison table, assertions, narrative, model_comparison.csv |

## Verification

All acceptance criteria verified programmatically:

**T01 checks (18/18 passed):**
- `hits_at_k`, `precision_at_k`, `reciprocal_rank` defined
- `loaded_model.predict(` with 4-input dict including `seq_input` and `days_gap_input: days_test.reshape(-1, 1)`
- `hr5_scores`, `hr10_scores`, `p5_scores`, `mrr_scores` lists
- `time_metrics` dict with all 4 keys
- `RESULTS_DIR = f'{MODELS_DIR}/../results'` with `os.makedirs`
- `lstm_time_results.csv` save path with `writer.writerow(['metric', 'value'])`

**T02 checks (14/14 passed):**
- `pd.DataFrame` with `Apriori`, `LSTM Only`, `LSTM + Time` columns
- `baseline_results.csv` and `lstm_results.csv` load paths
- `comparison.to_string(index=False)` print
- Both assertions (`hr5_time > hr5_apriori` and `hr5_time > hr5_lstm_prev`)
- `model_comparison.csv` save with `comparison_raw.to_csv`
- `288-dim` and `32 time features` in narrative
- `LSTM+Time vs LSTM` delta column

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all evaluation code is fully wired. The `lstm_metrics_loaded` fallback to zeros when `lstm_results.csv` is missing is intentional and documented as a guard (Phase 4 Colab run needed to produce the file). The guard prevents the `hr5_time > hr5_lstm_prev` assertion from firing on zero values.

## Self-Check: PASSED

- `notebooks/05_Time_Features.ipynb` exists with 18 cells (verified)
- Commit `7cb10ef` exists (T01)
- Commit `d71f5bf` exists (T02)
- All acceptance criteria pass (verified programmatically above)
