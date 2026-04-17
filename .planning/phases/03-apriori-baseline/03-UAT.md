---
status: complete
phase: 03-apriori-baseline
source: [03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md]
started: 2026-04-13T12:40:00+05:30
updated: 2026-04-13T23:11:45+05:30
---

## Current Test

[testing complete]

## Tests

### 1. Notebook Exists and Loads
expected: File `notebooks/03_Apriori_Baseline.ipynb` exists. Opening it in Jupyter shows a structured notebook with clear sections for imports, data loading, transaction encoding, rule mining, evaluation, and limitations.
result: pass

### 2. Sparse Transaction Matrix Builds Successfully
expected: Running the transaction encoding cells produces a sparse one-hot matrix from ~189K prior order baskets. No MemoryError or OOM crash. The matrix shape and sparsity are printed.
result: pass

### 3. Association Rules Are Mined
expected: Running the Apriori cells with MIN_SUPPORT=0.01 and MIN_CONFIDENCE=0.2 produces a `rules` DataFrame with columns including antecedents, consequents, support, confidence, and lift. The DataFrame is non-empty.
result: pass

### 4. apriori_recommend() Function Works
expected: The notebook contains an `apriori_recommend()` function that takes a set of query products and returns ranked recommendations based on confidence-ranked rule firing.
result: pass

### 5. Leave-One-Out Evaluation Completes
expected: The evaluation cell runs against 640 evaluable test users (eval_set='train'). It computes HR@5, HR@10, Precision@5, and MRR metrics without errors. Metrics are printed in the notebook output.
result: pass

### 6. baseline_results.csv Generated
expected: File `data/processed/baseline_results.csv` exists with columns `metric,value` and 4 rows: HR@5, HR@10, Precision@5, MRR. Values are numeric (e.g., HR@5≈0.031).
result: pass

### 7. Limitation Narrative Present
expected: The notebook ends with a markdown cell titled "## Apriori Baseline: Limitations and LSTM Improvements" covering 5 limitations (item order, time-awareness, personalization, cold start, session modeling). Each limitation is 3-4 sentences and connects to a specific LSTM/FreshCart innovation.
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
