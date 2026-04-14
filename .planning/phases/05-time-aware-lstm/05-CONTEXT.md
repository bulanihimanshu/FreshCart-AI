# Phase 05: Time-Aware LSTM - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Extending the core LSTM model to accept and incorporate three time features (`order_hour_of_day`, `order_dow`, `days_since_prior_order`) alongside the item sequences, yielding a time-aware model (`lstm_time_model.h5`).

</domain>

<decisions>
## Implementation Decisions

### Model I/O Formulation
- **D-01:** Structure the model with 4 separate Input layers (`[seq_input, hour, dow, days_gap]`), keeping explicit and standard Keras patterns. Wait to concatenate them until after the item sequences pass through the LSTM blocks.

### Days-Gap Normalization
- **D-02:** Normalize `days_since_prior_order` (which ranges from 0.0 to 30.0) using simple MinMax scaling to 0.0–1.0 (i.e. by dividing the feature by 30.0) before passing it into its Dense layer.

### Evaluation Output Format
- **D-03:** The Apriori vs LSTM vs LSTM+Time results will be formatted as a Pandas DataFrame and printed cleanly in the notebook, ensuring a clear comparative output.

### Carrying Forward from Phase 4
- **D-04:** Use `mask_zero=True` in Embedding (for sequences).
- **D-05:** Pass numpy arrays directly to `model.fit()`.
- **D-06:** Data loaded via Google Drive mount in Colab.
- **D-07:** Batch Size for training = `512`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Specs
- `.planning/REQUIREMENTS.md` §ML-05 — Core requirement for time-aware LSTM features and merging logic.
- `.planning/PROJECT.md` §Context — Specifies time feature architecture (hour embedding 24→16, DOW embedding 7→8, float days gap → dense 8, concat to 288-dim).

### Asset Context
- `.planning/phases/04-lstm-core-model/04-CONTEXT.md` — Explains the core model baseline that this phase extends.

</canonical_refs>

<deferred>
## Deferred Ideas
None.
</deferred>
