---
plan: "01-02"
phase: 1
status: complete
started: 2026-04-11
completed: 2026-04-11
---

# Summary: 01-02 Sampling Script

## What was built
Created `scripts/sampling.py` — a standalone script that reads the raw Instacart dataset directly from `data/raw/instacart_dataset.zip`, samples 10,000 "active" users (those with ≥5 prior orders), and saves filtered CSV files to `data/processed/`.

Features:
- Reads CSVs directly from zip (no pre-extraction needed)
- Handles nested zip directory structures and alternate CSV naming
- Configurable via CLI flags: `--min-orders`, `--n-users`, `--seed`
- 4-step pipeline: extract → sample → save → verify
- Built-in output verification step

## Key files

### Created
- `scripts/sampling.py` — Main sampling script (165 lines)

## Self-Check: PASSED
- `python -m py_compile scripts/sampling.py` exits 0 ✓
- `python scripts/sampling.py --help` displays correct usage ✓
- Contains `def sample_active_users` ✓
- Contains `def extract_zip` ✓
- Contains argparse with `--min-orders`, `--n-users`, `--seed` ✓
- References `data/raw/instacart_dataset.zip` ✓
- Outputs to `data/processed/` ✓

## Deviations
- Added `find_csv_in_zip()` helper to handle nested directory structures inside the zip (Kaggle zips sometimes have a wrapper directory)
- Added `__MACOSX` filtering for cross-platform compatibility

## Note
The script writes the code only. Running `python scripts/sampling.py` (which processes the 200MB dataset) must be done manually by the user after installing pandas/numpy.
