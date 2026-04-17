# Phase 03: Discussion Log

**Date:** 2026-04-12
**Phase:** Apriori Baseline

## Q&A Audit Trail

### Area 1: Apriori Hyperparameters

**Q:** min_support and min_confidence values — `0.01/0.2` (balanced), `0.005/0.1` (more rules), or configurable constants?

**A:** Option 1 — `min_support=0.01, min_confidence=0.2` (fixed, defined as named constants in notebook)

---

### Area 2: Transaction Definition

**Q:** One transaction = one order's basket, or one transaction = a user's full order history?

**A:** Option 1 — Order-level (one transaction per order, canonical market basket formulation)

---

### Area 3: Evaluation Methodology

**Q:** Leave-one-out on test users' last order, full order as query, or rule-coverage rate?

**A:** Option 1 — Leave-one-out: query = second-to-last order items, ground truth = last order items, HR@K across 1,000 test users

---

### Area 4: Limitation Narrative

**Q:** Reproduce PRD table verbatim, write narrative in own words, or both?

**A:** Option 2 — Narrative in own words (3-4 sentences per limitation, each connecting to how LSTM addresses it)
