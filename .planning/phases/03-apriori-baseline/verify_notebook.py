"""Verify 03_Apriori_Baseline.ipynb acceptance criteria."""
import json

with open("notebooks/03_Apriori_Baseline.ipynb") as f:
    nb = json.load(f)

src = "\n".join(["".join(c["source"]) for c in nb["cells"]])

checks = [
    ("MIN_SUPPORT = 0.01", "MIN_SUPPORT    = 0.01" in src),
    ("MIN_CONFIDENCE = 0.2", "MIN_CONFIDENCE = 0.2" in src),
    ("DATA_DIR", 'DATA_DIR = "../data/processed"' in src),
    ("mlxtend imports", "from mlxtend.frequent_patterns import apriori, association_rules" in src),
    ("TransactionEncoder", "te = TransactionEncoder()" in src),
    ("apriori call", "apriori(basket_df, min_support=MIN_SUPPORT, use_colnames=True)" in src),
    ("assoc rules call", 'association_rules(frequent_itemsets, metric="confidence", min_threshold=MIN_CONFIDENCE)' in src),
    ("eval_set filter", 'orders["eval_set"] == "prior"' in src),
    ("X_test key=sequences", 'test_data["sequences"]' in src),
    ("idx_to_product", "idx_to_product = {v: k for k, v in vocab.items()}" in src),
    ("apriori_recommend def", "def apriori_recommend(query_products, rules_df, top_k=10):" in src),
    ("issubset", "ant.issubset(query_set)" in src),
    ("ground_truth", "ground_truth = set([products[-1]])" in src),
    ("query", "query = set(products[:-1])" in src),
    ("baseline_results CSV", "baseline_results.to_csv(save_path, index=False)" in src),
    ("Limitations heading", "## Apriori Baseline: Limitations and LSTM Improvements" in src),
    ("Limitation 1", "### 1. Ignores Item Order" in src),
    ("Limitation 2", "### 2. Ignores Temporal Context" in src),
    ("Limitation 3", "### 3. No Personalization" in src),
    ("Limitation 4", "### 4. Cold Start Failure" in src),
    ("Limitation 5", "### 5. No Session Modeling" in src),
    ("Last cell is markdown", nb["cells"][-1]["cell_type"] == "markdown"),
    ("Cell count >= 14", len(nb["cells"]) >= 14),
]

print(f"Total checks: {len(checks)}")
for name, passed in checks:
    status = "PASS" if passed else "FAIL"
    print(f"  {status}  {name}")

failed = [n for n, p in checks if not p]
print(f"\nResult: {len(checks) - len(failed)}/{len(checks)} passed")
if failed:
    print(f"FAILED: {failed}")
else:
    print("ALL PASSED")
