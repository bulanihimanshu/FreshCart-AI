# Phase 6: Cold Start System - Discussion Log

**Date:** 2026-04-17

## Q1: JSON Data Richness
**Options Presented:**
- 1A: Just `product_id` arrays (Backend hydrates details)
- 1B: Full product objects in JSON

**Selected:** 1A (Just `product_id` arrays)

## Q2: Tier 2 Deduplication
**Options Presented:**
- 2A: Absolute Top 10 (regardless of purchase history)
- 2B: Discovery only (never-bought items only)
- 2C: Cart exclusion only (allow past purchases, but exclude current cart items)

**Selected:** 2C (Cart exclusion only)

## Q3: Fallback Strategy
**Options Presented:**
- 3A: Pad with Tier 1 (Global Top 20) if fewer than 5 items
- 3B: Strict return (only what was generated)

**Selected:** 3A (Pad with Tier 1)
