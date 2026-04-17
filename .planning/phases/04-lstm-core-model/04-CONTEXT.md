# Phase 04: LSTM Core Model - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase covers building, training, and evaluating the core sequential recommendation engine:
1. **Architecture:** Implement a 2-layer stacked LSTM (`Embedding -> LSTM -> LSTM -> Dropout -> Dense`) from scratch in Keras.
2. **Training Execution:** Load prepared data, configure the training process, and run training over a T4 GPU on Google Colab until Early Stopping triggers.
3. **Evaluation:** Use the exact same leave-one-out evaluation loop defined in Phase 3 to evaluate HR@K, Precision@K, and MRR. Generate comparable metrics and export the saved model weights (`lstm_model.h5`).

</domain>

<decisions>
## Implementation Decisions

### Model Padding Support
- **D-01:** Set `mask_zero=True` directly in the initial `Embedding` layer. The Keras masking layer will seamlessly flow through the LSTM layers, effectively ignoring padding zeros from the fixed-length 100-step sequences.

### Data Pipeline Design
- **D-02:** Pass the in-memory numpy arrays directly into `model.fit(X, y)`. Given the 10K user subset size, avoiding the overhead of `tf.data.Dataset` or custom Generators simplifies the code, and everything will easily fit in Colab's standard RAM. Note: The notebook will need to dynamically slice the sequence arrays to formulate `X` and `y` targets before fitting.

### Colab Data Execution Workflow
- **D-03:** Data files (`X_train.npz`, `vocab.json`, etc.) will be made available via a Google Drive Mount (`from google.colab import drive`). This avoids manually uploading large arrays every runtime reset.

### Training Batch Size
- **D-04:** Batch Size = `512`. This strikes a well-tested balance for preventing Out Of Memory (OOM) errors on a 16GB Colab T4 GPU while keeping epoch times pleasantly fast for iterative testing.

### the agent's Discretion
- Code details on reshaping the raw input sequences into training targets.
- How visualization (matplotlib curves for `loss` / `HR@K` vs epochs) is laid out.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & Protocols
- `.planning/REQUIREMENTS.md` §ML-04 — Core architectural and artifact requirements.
- `.planning/PROJECT.md` §Context — LSTM architecture spec (256-dim hidden, dropout 0.3).
- `.planning/phases/03-apriori-baseline/03-CONTEXT.md` §Evaluation Methodology — Specifies the Leave-one-out metrics baseline and protocol that the LSTM evaluation must mirror exactly.

### Assets
- `data/processed/X_train.npz` (and val/test) — Input sequences.
- `data/processed/vocab.json` — Word mappings for the model.

</canonical_refs>

<deferred>
## Deferred Ideas
None.
</deferred>
