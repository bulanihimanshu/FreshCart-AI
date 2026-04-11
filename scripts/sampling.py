"""
sampling.py — FreshCart AI
Extracts and samples the Instacart dataset to produce a 10K active-user subset.

Usage:
    python scripts/sampling.py
    python scripts/sampling.py --min-orders 5 --n-users 10000 --seed 42

Output (data/processed/):
    orders_subset.csv          — Orders for sampled users only
    order_products_subset.csv  — Order line items for sampled users only
    products.csv               — Full products table (needed for name lookups)
    aisles.csv                 — Full aisles table
    departments.csv            — Full departments table
"""

import os
import zipfile
import argparse
import pandas as pd
import numpy as np

RAW_ZIP      = "data/raw/instacart_dataset.zip"
PROCESSED    = "data/processed"

# Expected CSV filenames inside the zip (Kaggle Instacart dataset standard names)
ORDERS_CSV              = "orders.csv"
ORDER_PRODUCTS_CSV      = "order_products__prior.csv"   # prior orders only
PRODUCTS_CSV            = "products.csv"
AISLES_CSV              = "aisles.csv"
DEPARTMENTS_CSV         = "departments.csv"


def parse_args():
    p = argparse.ArgumentParser(description="Sample Instacart dataset")
    p.add_argument("--min-orders", type=int, default=5,
                   help="Minimum prior orders for a user to be included (default: 5)")
    p.add_argument("--n-users", type=int, default=10000,
                   help="Number of users to sample (default: 10000)")
    p.add_argument("--seed", type=int, default=42,
                   help="Random seed for reproducibility (default: 42)")
    return p.parse_args()


def find_csv_in_zip(zip_ref, target_basename):
    """Find a CSV file inside the zip, handling nested directory structures."""
    for name in zip_ref.namelist():
        if os.path.basename(name) == target_basename and not name.startswith("__MACOSX"):
            return name
    return None


def extract_zip(zip_path: str) -> dict:
    """Extract all required CSVs from the zip into memory."""
    print(f"[1/4] Extracting CSVs from {zip_path}...")
    required = {ORDERS_CSV, ORDER_PRODUCTS_CSV, PRODUCTS_CSV, AISLES_CSV, DEPARTMENTS_CSV}
    frames = {}
    with zipfile.ZipFile(zip_path, "r") as z:
        available = set(os.path.basename(n) for n in z.namelist()
                        if not n.startswith("__MACOSX"))
        missing = required - available
        if missing:
            # Try alternate naming conventions
            alt_names = {
                "order_products__prior.csv": ["order_products__train.csv"],
            }
            still_missing = set()
            for m in missing:
                found_alt = False
                for alt in alt_names.get(m, []):
                    if alt in available:
                        required.discard(m)
                        required.add(alt)
                        found_alt = True
                        break
                if not found_alt:
                    still_missing.add(m)

            if still_missing:
                print(f"  Available files: {sorted(available)}")
                raise FileNotFoundError(
                    f"Missing files in zip: {still_missing}\n"
                    f"Available files: {sorted(available)}"
                )

        for target in required:
            full_path = find_csv_in_zip(z, target)
            if full_path:
                print(f"  Reading {target}...")
                with z.open(full_path) as f:
                    frames[target] = pd.read_csv(f)

    print(f"  Done. Loaded {len(frames)} CSVs.")
    return frames


def sample_active_users(orders: pd.DataFrame, min_orders: int,
                        n_users: int, seed: int) -> np.ndarray:
    """
    Sample n_users from users who have at least min_orders prior orders.
    'Prior' orders are eval_set == 'prior' in Instacart's orders.csv.
    """
    print(f"[2/4] Sampling {n_users} users with >= {min_orders} prior orders...")
    prior_orders = orders[orders["eval_set"] == "prior"]
    order_counts = prior_orders.groupby("user_id")["order_id"].count()
    active_users = order_counts[order_counts >= min_orders].index

    print(f"  Active users (>= {min_orders} orders): {len(active_users):,}")
    if len(active_users) < n_users:
        print(f"  WARNING: Only {len(active_users):,} active users found — "
              f"using all of them (requested {n_users:,})")
        sampled = active_users.values
    else:
        rng = np.random.default_rng(seed)
        sampled = rng.choice(active_users.values, size=n_users, replace=False)

    print(f"  Sampled {len(sampled):,} users.")
    return sampled


def save_subset(frames: dict, user_ids: np.ndarray,
                out_dir: str) -> None:
    """Filter all tables to sampled users and write to out_dir."""
    print(f"[3/4] Filtering and saving subset to {out_dir}/...")
    os.makedirs(out_dir, exist_ok=True)

    user_set = set(user_ids)

    # Determine which orders CSV key we have
    orders_key = ORDERS_CSV
    orders_df = frames[orders_key]

    # Filter orders to sampled users (all eval_sets: prior + train + test)
    orders_sub = orders_df[orders_df["user_id"].isin(user_set)]
    sampled_order_ids = set(orders_sub["order_id"].values)

    # Determine which order_products CSV key we have
    op_key = ORDER_PRODUCTS_CSV if ORDER_PRODUCTS_CSV in frames else list(
        k for k in frames if "order_products" in k)[0]
    op_df = frames[op_key]

    # Filter order_products to sampled users' order IDs
    op_sub = op_df[op_df["order_id"].isin(sampled_order_ids)]

    # Reference tables — keep all rows (needed for product name lookups)
    products_df    = frames[PRODUCTS_CSV]
    aisles_df      = frames[AISLES_CSV]
    departments_df = frames[DEPARTMENTS_CSV]

    # Save
    orders_sub.to_csv(os.path.join(out_dir, "orders_subset.csv"), index=False)
    op_sub.to_csv(os.path.join(out_dir, "order_products_subset.csv"), index=False)
    products_df.to_csv(os.path.join(out_dir, "products.csv"), index=False)
    aisles_df.to_csv(os.path.join(out_dir, "aisles.csv"), index=False)
    departments_df.to_csv(os.path.join(out_dir, "departments.csv"), index=False)

    print(f"  orders_subset.csv      : {len(orders_sub):,} rows")
    print(f"  order_products_subset  : {len(op_sub):,} rows")
    print(f"  products.csv           : {len(products_df):,} rows (full table)")
    print(f"  aisles.csv             : {len(aisles_df):,} rows (full table)")
    print(f"  departments.csv        : {len(departments_df):,} rows (full table)")


def verify_outputs(out_dir: str) -> None:
    """Quick sanity check that all expected files exist and are non-empty."""
    print("[4/4] Verifying outputs...")
    expected = [
        "orders_subset.csv",
        "order_products_subset.csv",
        "products.csv",
        "aisles.csv",
        "departments.csv",
    ]
    for fname in expected:
        fpath = os.path.join(out_dir, fname)
        if not os.path.exists(fpath):
            raise FileNotFoundError(f"MISSING: {fpath}")
        size_mb = os.path.getsize(fpath) / 1_000_000
        print(f"  {fname:40s} {size_mb:.1f} MB")
    print("  All outputs verified. ✓")


def main():
    args = parse_args()
    print("=" * 60)
    print("FreshCart AI — Instacart Dataset Sampler")
    print("=" * 60)

    frames   = extract_zip(RAW_ZIP)
    user_ids = sample_active_users(
        frames[ORDERS_CSV], args.min_orders, args.n_users, args.seed
    )
    save_subset(frames, user_ids, PROCESSED)
    verify_outputs(PROCESSED)

    print("=" * 60)
    print(f"Done! Subset saved to {PROCESSED}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
