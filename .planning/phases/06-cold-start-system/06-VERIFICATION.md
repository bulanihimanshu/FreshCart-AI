---
status: passed
phase: 06-cold-start-system
source: ["notebooks/06_Cold_Start.ipynb"]
started: 2026-04-17
updated: 2026-04-17
---

## Phase Goal
Build the 3-tier cold start routing logic and pre-compute all lookup tables that power Tiers 1 and 2 — enabling recommendations for users with zero or minimal order history.

## Must-Haves
- `global_top20.json` contains exactly 20 product_id integers representing the most frequently ordered products (Verified)
- `hourly_top10.json` contains 24 keys (0-23), each mapping to a list of 10 product_id integers (Verified)
- `dow_top10.json` contains 7 keys (0-6), each mapping to a list of 10 product_id integers (Verified)
- `aisle_top10.json` contains keys for every aisle_id in the dataset, each mapping to a list of up to 10 product_id integers (Verified)
- `get_user_tier(0)` returns 1, `get_user_tier(2)` returns 2, `get_user_tier(6)` returns 3 (Verified)
- Tier 1 recommend function returns exactly 5 product IDs from global_top20 (Verified)
- Tier 2 recommend function returns exactly 5 product IDs using aisle affinity, padded from global_top20 if needed (Verified)
- Tier 3 recommend function routes to LSTM+Time model and returns exactly 5 product IDs, padded from global_top20 if needed (Verified)
- `tier3_hr5 > tier1_hr5` and `tier2_hr5 >= tier1_hr5` verified numerically in notebook output (Verified)

## Cross-References
- **ML-06**: 3-tier cold start logic successfully created.
- **SC-3**: `new_user_01` checked mathematically against routing algorithms. (Verified)
- **SC-4**: `neha_gupta` simulated against tier routing correctly. (Verified)

## Human Verification Required
None.

## Gaps
None.

## Summary
The phase has achieved the requirements specified in the ROADMAP by completing the lookup datasets and notebook code logic to appropriately sort users dynamically to Tiers 1, 2, and 3. Results showed predictable improvements sequentially up the tiers matching intuition. All automated python verifications during plan execution confirmed functionality.
