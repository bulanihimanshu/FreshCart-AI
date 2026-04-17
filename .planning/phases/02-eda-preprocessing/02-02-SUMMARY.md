---
plan: "02-02"
phase: 2
status: complete
started: 2026-04-12
completed: 2026-04-12
---

# Summary: 02-02 Preprocessing — Sequences & Vocabulary

## What was built
Created the first half of `notebooks/02_Preprocessing.ipynb`: per-user item sequences built from Instacart order history (sorted chronologically), vocabulary of 5,001 entries (PAD + top 5,000 products by total frequency), integer encoding with pre-padding to length 100.

## Key files

### Created
- `notebooks/02_Preprocessing.ipynb` — Preprocessing notebook (Part 1: Steps 1-3)
- `data/processed/vocab.json` — 5,001-entry vocabulary (PAD=0, products indexed 1-5000)
- `data/processed/sequences.npz` — Intermediate sequences array, shape (10000, 100), int32

## Self-Check: PASSED
- notebooks/02_Preprocessing.ipynb exists and is valid JSON ✓
- vocab.json has exactly 5,001 entries ✓
- vocab.json has PAD token at index 0 ✓
- sequences.npz shape is (10000, 100) with dtype int32 ✓
- Sequences sorted by user_id, order_number, add_to_cart_order ✓
- Pre-padding on left (most recent items at end of sequence) ✓

## Deviations
- Plan referenced `orders.csv`/`order_products_prior.csv` but actual filenames are `orders_subset.csv`/`order_products_subset.csv`. Notebook uses correct names.
- Combined Plans 02-02 and 02-03 into a single notebook (02_Preprocessing.ipynb) since the roadmap defines them as parts of the same notebook.
