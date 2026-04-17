"""
FreshCart AI — Cold Start Tier Router

Implements the 3-tier cold start recommendation strategy:

  Tier 1 (0 orders)    → global popularity + time-based fallback
  Tier 2 (1–2 orders)  → aisle-affinity (category-based) recommendations
  Tier 3 (3+ orders)   → full LSTM+Time personalised recommendations

The ``get_recommendations`` entry-point accepts the user's order count,
cart contents, and time context, and routes to the correct strategy.
"""

from __future__ import annotations

import logging
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tier classification
# ---------------------------------------------------------------------------

def get_user_tier(order_count: int) -> int:
    """Return cold-start tier (1, 2, or 3) based on historical order count."""
    if order_count == 0:
        return 1
    if order_count <= 2:
        return 2
    return 3


# ---------------------------------------------------------------------------
# Tier 1 — global popularity + time context
# ---------------------------------------------------------------------------

def _tier1_recommendations(
    app_state: Any,
    hour: int,
    dow: int,
    cart_items: list[int],
    top_k: int,
) -> list[dict]:
    """
    Return up to *top_k* recommendations for a brand-new user.

    Priority order:
    1. Hourly top-10 for the given hour (if available)
    2. Day-of-week top-10 for the given dow (if available)
    3. Global top-20 fallback

    Items already in the cart are excluded.
    """
    cart_set = set(cart_items)
    seen: set[int] = set()
    candidates: list[int] = []

    def _add_from(source: list[int]) -> None:
        for pid in source:
            if pid not in cart_set and pid not in seen:
                seen.add(pid)
                candidates.append(pid)

    # Hourly bucket (keys are strings in JSON)
    hourly = app_state.hourly_top10
    if hourly:
        hour_key = str(hour)
        _add_from(hourly.get(hour_key, []))

    # Day-of-week bucket
    dow_table = app_state.dow_top10
    if dow_table:
        dow_key = str(dow)
        _add_from(dow_table.get(dow_key, []))

    # Global top-20 fallback
    _add_from(app_state.global_top20)

    results = []
    for pid in candidates[:top_k]:
        product_info = app_state.products_df.get(pid, {})
        results.append(
            {
                "product_id": pid,
                "name": product_info.get("name", f"Product {pid}"),
                "score": None,
            }
        )
    return results


# ---------------------------------------------------------------------------
# Tier 2 — aisle-affinity recommendations
# ---------------------------------------------------------------------------

def _tier2_recommendations(
    app_state: Any,
    cart_items: list[int],
    hour: int,
    dow: int,
    top_k: int,
) -> list[dict]:
    """
    Return up to *top_k* recommendations for a user with 1–2 orders.

    Strategy:
    - Identify the aisles of items currently in the cart.
    - Return the top items from those aisles using `aisle_top10`.
    - Fall back to Tier 1 logic if aisle data is unavailable.
    """
    cart_set = set(cart_items)
    aisle_top10: dict[str, list[int]] = app_state.aisle_top10
    products_lookup: dict[int, dict] = app_state.products_df

    # Collect cart-item aisles
    cart_aisles: list[int] = []
    for pid in cart_items:
        info = products_lookup.get(pid, {})
        aisle_id = info.get("aisle_id")
        if aisle_id is not None and aisle_id not in cart_aisles:
            cart_aisles.append(aisle_id)

    seen: set[int] = set()
    candidates: list[int] = []

    def _add_from(source: list[int]) -> None:
        for pid in source:
            if pid not in cart_set and pid not in seen:
                seen.add(pid)
                candidates.append(pid)

    # Pull top items from each cart aisle
    for aisle_id in cart_aisles:
        aisle_key = str(aisle_id)
        _add_from(aisle_top10.get(aisle_key, []))

    # If not enough from aisles, pad with Tier 1 logic
    if len(candidates) < top_k:
        tier1 = _tier1_recommendations(app_state, hour, dow, cart_items, top_k * 2)
        for item in tier1:
            pid = item["product_id"]
            if pid not in seen and pid not in cart_set:
                seen.add(pid)
                candidates.append(pid)

    results = []
    for pid in candidates[:top_k]:
        product_info = products_lookup.get(pid, {})
        results.append(
            {
                "product_id": pid,
                "name": product_info.get("name", f"Product {pid}"),
                "score": None,
            }
        )
    return results


# ---------------------------------------------------------------------------
# Tier 3 — full LSTM+Time personalised recommendations
# ---------------------------------------------------------------------------

def _tier3_recommendations(
    app_state: Any,
    cart_items: list[int],
    hour: int,
    dow: int,
    days_gap: float,
    top_k: int,
) -> list[dict]:
    """
    Return up to *top_k* personalised recommendations using the LSTM+Time model.

    The cart item sequence is converted to vocab indices.  The model expects:
      - seq_input:       (1, seq_len) integer array of vocab indices
      - hour_input:      (1, 1) integer array
      - dow_input:       (1, 1) integer array
      - days_gap_input:  (1, 1) float array (normalised by / 30.0)

    Outputs a softmax probability vector over the full vocabulary.
    Top-k products (excluding cart items and padding token 0) are returned.

    Falls back to Tier 2 if the model is unavailable or inference fails.
    """
    model = app_state.lstm_time_model
    vocab: dict[str, int] = app_state.vocab
    products_lookup: dict[int, dict] = app_state.products_df

    if model is None:
        logger.warning("LSTM model not loaded — falling back to Tier 2.")
        return _tier2_recommendations(app_state, cart_items, hour, dow, top_k)

    # Map product_ids → vocab indices (unknown products → padding index 0)
    id_to_idx = {int(k): v for k, v in vocab.items() if k.isdigit()}
    sequence = [id_to_idx.get(pid, 0) for pid in cart_items]

    # Pad / truncate to a fixed-length sequence (max 50 items)
    SEQ_LEN = 50
    if len(sequence) == 0:
        sequence = [0]  # at least one token
    if len(sequence) > SEQ_LEN:
        sequence = sequence[-SEQ_LEN:]
    while len(sequence) < SEQ_LEN:
        sequence = [0] + sequence  # left-pad with zeros

    try:
        seq_arr = np.array([sequence], dtype=np.int32)                 # (1, SEQ_LEN)
        hour_arr = np.array([[hour]], dtype=np.int32)                  # (1, 1)
        dow_arr = np.array([[dow]], dtype=np.int32)                    # (1, 1)
        days_gap_norm = np.array([[days_gap / 30.0]], dtype=np.float32)  # (1, 1)

        preds = model.predict(
            {
                "seq_input": seq_arr,
                "hour_input": hour_arr,
                "dow_input": dow_arr,
                "days_gap_input": days_gap_norm,
            },
            verbose=0,
        )  # shape: (1, vocab_size)

        probs = preds[0]  # (vocab_size,)
    except Exception as exc:  # noqa: BLE001
        logger.error("LSTM inference failed: %s — falling back to Tier 2.", exc)
        return _tier2_recommendations(app_state, cart_items, hour, dow, top_k)

    # Convert vocab index → product_id (reverse of id_to_idx)
    idx_to_id = {v: k for k, v in id_to_idx.items()}

    cart_set = set(cart_items)
    top_indices = np.argsort(probs)[::-1]

    results: list[dict] = []
    for idx in top_indices:
        if idx == 0:
            continue  # padding token
        pid = idx_to_id.get(int(idx))
        if pid is None or pid in cart_set:
            continue
        product_info = products_lookup.get(pid, {})
        results.append(
            {
                "product_id": pid,
                "name": product_info.get("name", f"Product {pid}"),
                "score": float(probs[idx]),
            }
        )
        if len(results) >= top_k:
            break

    # Final safety fallback — if no results from LSTM
    if not results:
        logger.warning("LSTM returned no usable predictions — falling back to Tier 2.")
        return _tier2_recommendations(app_state, cart_items, hour, dow, top_k)

    return results


# ---------------------------------------------------------------------------
# Public entry-point
# ---------------------------------------------------------------------------

def get_recommendations(
    *,
    app_state: Any,
    order_count: int,
    cart_items: list[int],
    hour: int = 12,
    dow: int = 0,
    days_gap: float = 7.0,
    top_k: int = 5,
) -> tuple[list[dict], int]:
    """
    Route a recommendation request to the correct cold-start tier.

    Parameters
    ----------
    app_state:   FastAPI ``app.state`` object holding all loaded artefacts.
    order_count: Historical order count for the user (determines tier).
    cart_items:  List of product_id integers currently in the cart.
    hour:        Hour of day (0–23).
    dow:         Day of week (0=Monday … 6=Sunday).
    days_gap:    Days since the user's last order (normalised in Tier 3).
    top_k:       Number of recommendations to return.

    Returns
    -------
    (recommendations, tier_used)
    """
    tier = get_user_tier(order_count)
    logger.info(
        "Routing recommendation: order_count=%d → Tier %d  cart=%s",
        order_count,
        tier,
        cart_items,
    )

    if tier == 1:
        recs = _tier1_recommendations(app_state, hour, dow, cart_items, top_k)
    elif tier == 2:
        recs = _tier2_recommendations(app_state, cart_items, hour, dow, top_k)
    else:
        recs = _tier3_recommendations(app_state, cart_items, hour, dow, days_gap, top_k)

    return recs, tier
