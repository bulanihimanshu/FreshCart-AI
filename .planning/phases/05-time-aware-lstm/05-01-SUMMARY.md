---
phase: 05-time-aware-lstm
plan: "05-01"
subsystem: ml
tags: [tensorflow, keras, lstm, functional-api, time-features, embeddings]

# Dependency graph
requires:
  - phase: 04-lstm-core-model
    provides: Sequential LSTM baseline architecture and notebook patterns (Drive mount, npz loading, sequence slicing)
provides:
  - notebooks/05_Time_Features.ipynb with Keras Functional API multi-input time-aware LSTM model definition
  - 4 named Input layers (seq_input, hour_input, dow_input, days_gap_input)
  - 288-dim fused representation: LSTM(256) + time_vector(32)
  - Synthetic time feature generation for Colab training/validation
affects: [05-02-training, 05-03-evaluation, 08-backend]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Keras Functional API for multi-input models (4 explicit Input layers, named)"
    - "Time feature encoding: integer embeddings (hour, dow) + scalar Dense (days_gap)"
    - "Late fusion: concatenate temporal context with LSTM output before classification"

key-files:
  created:
    - notebooks/05_Time_Features.ipynb
  modified: []

key-decisions:
  - "Keras Functional API with 4 explicit Input layers per D-01 (not Sequential)"
  - "days_gap normalized by / 30.0 per D-02 before Dense layer"
  - "mask_zero=True retained on sequence Embedding per D-04"
  - "Synthetic time features generated for architecture validation; real time context wired in Phase 8 (Backend)"
  - "Time vector is 32-dim: hour(16) + dow(8) + days_gap(8); fused to 288-dim with LSTM(256) output"

patterns-established:
  - "Multi-input Keras model: define all Input layers first, then build each path separately, concatenate last"
  - "Time embedding dims: hour 24->16, DOW 7->8, float gap -> Dense 8"

requirements-completed: [ML-05]

# Metrics
duration: 3min
completed: 2026-04-16
---

# Phase 5 Plan 01: Time-Aware LSTM — Notebook Setup & Model Definition Summary

**Keras Functional API time-aware LSTM with 4 Input layers fusing 256-dim LSTM output and 32-dim temporal context vector into 288-dim softmax classifier over 5001 items**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-16T09:37:14Z
- **Completed:** 2026-04-16T09:39:48Z
- **Tasks:** 1/1
- **Files modified:** 1

## Accomplishments

- Created `notebooks/05_Time_Features.ipynb` with 7 cells (1 markdown + 6 code) matching all plan acceptance criteria
- Implemented Keras Functional API model with 4 named Input layers: seq_input (int32, 99), hour_input (int32, scalar), dow_input (int32, scalar), days_gap_input (float32, 1)
- Time path: Embedding(24->16) for hour, Embedding(7->8) for DOW, Dense(1->8) for days_gap — concatenated to 32-dim time vector
- Fusion: LSTM output 256-dim + time vector 32-dim = 288-dim fed to Dense(5001, softmax)
- Synthetic time feature generator (`make_time_features`) with proper dtypes and / 30.0 normalization per D-02

## Task Commits

Each task was committed atomically:

1. **Task 05-01-T01: Create notebook with imports and Google Drive data loading** - `a42b310` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `notebooks/05_Time_Features.ipynb` — Full time-aware LSTM notebook: imports, Drive mount, data loading (sequences key), sequence slicing, synthetic time features, Keras Functional API model definition, model compile

## Decisions Made

- Used single-space formatting for `keras.Input(...)` calls to match acceptance criteria exactly (alignment spaces were causing string-match failures)
- Followed all decisions from 05-CONTEXT.md: D-01 (4 Input layers), D-02 (/ 30.0 normalization), D-04 (mask_zero=True), D-06 (Drive mount pattern), D-07 (batch size 512 deferred to training plan)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Initial notebook had alignment spaces in keras.Input() calls (`dtype='int32',   name=` with 3 spaces) which caused acceptance criteria string-match failures. Fixed by reformatting to single-space style — functionally identical, all 15 criteria now pass.

## Known Stubs

- **Synthetic time features** (`make_time_features` in Cell 4): hour, dow, days_gap are randomly generated rather than sourced from real orders data. This is intentional per plan note — Phase 8 (Backend) will wire real time context from user requests. Does not prevent architecture validation or training.

## Next Phase Readiness

- `notebooks/05_Time_Features.ipynb` is ready — model definition complete and compiles without errors
- Plan 05-02 can add training loop cells to this notebook
- Plan 05-03 can add evaluation cells using the trained `lstm_time_model.h5`

---
*Phase: 05-time-aware-lstm*
*Completed: 2026-04-16*
