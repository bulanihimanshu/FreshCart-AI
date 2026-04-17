# Phase 5: Time-Aware LSTM - Discussion Log

**Date:** 2026-04-14

## Q1: Model I/O formulation
**Question:** How should we pass the sequences and time features to the model?
- A. 4 separate Input layers `[seq_input, hour, dow, days_gap]` (Recommended — explicit, standard Keras pattern)
- B. Combine all time features into a single array before input (More complex preprocessing)

**User Selected:** A. 4 separate Input layers

## Q2: Days-gap normalization
**Question:** `days_since_prior_order` ranges from 0.0 to 30.0. How should we normalize it before feeding it to the Dense layer?
- A. MinMax scaling to 0.0–1.0 by dividing by 30.0 (Recommended — simple and bounded)
- B. Z-score standard scaling (mean 0, std 1)
- C. Treat as categorical/integer and use an Embedding layer instead of Dense

**User Selected:** A. MinMax scaling to 0.0–1.0 by dividing by 30.0

## Q3: Evaluation output format
**Question:** How should we display the Apriori vs LSTM vs LSTM+Time results comparison?
- A. Pandas DataFrame printed nicely in the notebook (Recommended — clean and easy to export)
- B. Manual markdown table printout
- C. Just dump the raw metrics dictionary

**User Selected:** A. Pandas DataFrame printed nicely in the notebook
