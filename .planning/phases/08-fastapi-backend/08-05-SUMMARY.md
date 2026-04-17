---
phase: "08"
plan: "05"
subsystem: fastapi-backend
tags: [professor-demo, evaluation, comparison, pandas, matplotlib]
dependency_graph:
  requires: ["08-04-PLAN.md"]
  provides: [professor_scripts/run_evaluation.py, professor_scripts/run_model_comparison.py]
  affects: [university delivery]
tech_stack:
  added: []
  patterns: [pandas dataframe print, standalone execution, local inference]
key_files:
  created:
    - professor_scripts/run_evaluation.py
    - professor_scripts/run_model_comparison.py
  modified: []
decisions:
  - "run_evaluation.py directly converts notebook code for out-of-band evaluation with static reporting, writing to root."
  - "run_model_comparison.py uses CLI flags via argparse to mock out cart/hour/dow scenarios and fall back to global popularity for mocked apriori."
metrics:
  duration: "10 minutes"
  completed: "2026-04-17"
  tasks_completed: 2
  files_changed: 2
---

# Phase 08 Plan 05: Professor Evaluation Scripts Summary

Implements standard terminal scripts required by the University context for out-of-band evaluation and demonstration of LSTM models.

## What Was Built

### Task 1: Evaluation Script (`professor_scripts/run_evaluation.py`)
Loaded all underlying dataset `.npz` sequences alongside the `.keras` and `.h5` model to generate HR@K evaluation alongside Precision and MRR metrics for 1000 combinations simultaneously. 
Constructs a cohesive side-by-side Pandas output table printed in standard `stdout`, generating `results.csv`, while also plotting validation using seaborn & `matplotlib` saved as `metrics_comparison.png`.

### Task 2: Model Comparison Script (`professor_scripts/run_model_comparison.py`)
Accepts specific `--cart`, `--hour`, and `--dow` flags via standard terminal `argparse`.
Loads the time-aware LSTM model alongside the products lookup mapping and evaluates inputs to dynamically predict top-5 matching contextual items. Compares predictions directly against baseline items simulating static global association rules for professor review.

## Deviations from Plan
### Mocking Apriori rules
Since the Apriori rules were never fully generated as files in `data/processed` by baseline implementations, we successfully mock and compare LSTM predictions against the Tier 1 global popular Fallbacks as the comparison proxy.

## Self-Check: PASSED
- `professor_scripts/run_evaluation.py` exists
- `professor_scripts/run_model_comparison.py` exists
- Output handles dynamic pandas tables properly and saves plot artifacts.
