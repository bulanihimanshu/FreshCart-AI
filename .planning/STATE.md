---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
current_phase: 08
status: executing
last_updated: "2026-04-17T17:26:45.391Z"
progress:
  total_phases: 10
  completed_phases: 7
  total_plans: 27
  completed_plans: 23
---

# STATE — FreshCart AI

## Current State

**Status:** Executing Phase 08
**Current phase:** 08
**Last updated:** 2026-04-17
**Last session:** Completed 08-01-PLAN.md (FastAPI app core, lifespan model loading, health endpoint)

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-11)

**Core value:** LSTM recommendations surfaced naturally in grocery UX, demoed without any technical explanation
**Current focus:** Phase 08 — fastapi-backend

## Phase History

- Phase 1: Data Foundation — complete
- Phase 2: EDA & Preprocessing — complete
- Phase 3: Apriori Baseline — complete  
- Phase 4: LSTM Core Model — notebook created (4/4 plans), awaiting Colab GPU training
- Phase 5: Time-Aware LSTM — all 3 plans complete (model definition, training pipeline, evaluation & comparison)

## Decisions Log

- NPZ files use key `sequences` not `arr_0` — fixed in notebook data loading
- Apriori baseline metrics loaded dynamically from CSV (actual HR@5=0.031, not PRD estimate 0.33)
- 05-01: Keras Functional API with 4 explicit Input layers (seq_input, hour_input, dow_input, days_gap_input) per D-01
- 05-01: days_gap normalized by / 30.0 per D-02; time vector is 32-dim (16+8+8); fusion yields 288-dim
- 05-01: Synthetic time features used for training; real time context wired in Phase 8 (Backend)
- 05-02: BATCH_SIZE=512 (D-07) prevents OOM on 16GB T4; EarlyStopping(patience=3, restore_best_weights=True) on val_loss; ModelCheckpoint saves to lstm_time_model.h5; days_gap_input reshaped to (-1,1) in fit() dict
- 05-03: Batch predict over 1,000 test users at once (not per-user loop) for GPU efficiency
- 05-03: LSTM+Time > LSTM assertion guarded — only fires when lstm_results.csv exists (non-zero Phase 4 values)
- 05-03: model_comparison.csv saved with raw floats for Phase 7 downstream parsing
- 08-01: lstm_time_model saved as .keras (not .h5) — MODEL_PATH uses .keras extension
- 08-01: Products lookup merges aisles + departments CSV at startup for D-05 hydration (product_id -> name/aisle/department)
- 08-01: CORSMiddleware uses explicit origins (localhost:5173, localhost:3000) not wildcard
