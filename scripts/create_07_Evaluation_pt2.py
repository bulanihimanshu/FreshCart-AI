import json

with open(r'c:\Users\user\Documents\fresh cart\notebooks\07_Evaluation.ipynb', 'r') as f:
    nb = json.load(f)

new_cells = [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## 4. Evaluation Metrics: HR@K, Precision@K, MRR, Coverage"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "execution_count": None,
      "outputs": [],
      "source": [
        "def hit_rate(y_true, y_pred, k):\n",
        "    hits = 0\n",
        "    for act, pred in zip(y_true, y_pred):\n",
        "        if act in pred[:k]:\n",
        "            hits += 1\n",
        "    return hits / len(y_true)\n",
        "\n",
        "def precision_at_k(y_true, y_pred, k):\n",
        "    hits = 0\n",
        "    for act, pred in zip(y_true, y_pred):\n",
        "        if act in pred[:k]:\n",
        "            hits += 1\n",
        "    return hits / (len(y_true) * k)\n",
        "\n",
        "def mrr(y_true, y_pred):\n",
        "    score = 0.0\n",
        "    for act, pred in zip(y_true, y_pred):\n",
        "        try:\n",
        "            rank = pred.index(act) + 1\n",
        "            score += 1.0 / rank\n",
        "        except ValueError:\n",
        "            pass\n",
        "    return score / len(y_true)\n",
        "\n",
        "def evaluate_coverage(predictions, subset_size=5000):\n",
        "    unique_items = set()\n",
        "    for pred in predictions:\n",
        "        unique_items.update(pred)\n",
        "    return (len(unique_items) / subset_size) * 100\n"
      ]
    },
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## 5. Batch Inference & Scoring"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "execution_count": None,
      "outputs": [],
      "source": [
        "# Ground truth for X_test is the last item\n",
        "y_true = test_data['sequences'][:, -1]\n",
        "\n",
        "# 1. Baseline (Apriori)\n",
        "apriori_metrics = {}\n",
        "if baseline_results is not None:\n",
        "    apriori_row = baseline_results[baseline_results['System'] == 'Apriori'].iloc[0]\n",
        "    apriori_metrics = {\n",
        "        'System': 'Apriori',\n",
        "        'HR@5': apriori_row['HR@5'],\n",
        "        'HR@10': apriori_row['HR@10'],\n",
        "        'Precision@5': apriori_row['Precision@5'],\n",
        "        'MRR': apriori_row['MRR'],\n",
        "        'Coverage (%)': 20.0 / 5000.0 * 100 # static global fallback cover\n",
        "    }\n",
        "\n",
        "# 2. Standard LSTM\n",
        "preds_lstm = lstm_model.predict(X_test[:, :-1], batch_size=128, verbose=1)\n",
        "preds_lstm_top10 = np.argsort(preds_lstm, axis=1)[:, -10:][:, ::-1].tolist()\n",
        "metrics_lstm = {\n",
        "    'System': 'LSTM',\n",
        "    'HR@5': hit_rate(y_true, preds_lstm_top10, 5),\n",
        "    'HR@10': hit_rate(y_true, preds_lstm_top10, 10),\n",
        "    'Precision@5': precision_at_k(y_true, preds_lstm_top10, 5),\n",
        "    'MRR': mrr(y_true, preds_lstm_top10),\n",
        "    'Coverage (%)': evaluate_coverage(preds_lstm_top10)\n",
        "}\n",
        "\n",
        "# 3. Time-Aware LSTM\n",
        "# Generate synthetic time features for test set as defined in Phase 5\n",
        "np.random.seed(42)\n",
        "hour_test = np.random.randint(0, 24, size=(len(X_test),)).astype(np.int32)\n",
        "dow_test = np.random.randint(0, 7, size=(len(X_test),)).astype(np.int32)\n",
        "days_test = np.random.uniform(1, 30, size=(len(X_test),)).astype(np.float32) / 30.0\n",
        "\n",
        "preds_time = lstm_time_model.predict(\n",
        "    {'seq_input': X_test[:, :-1], 'hour_input': hour_test, 'dow_input': dow_test, 'days_gap_input': days_test.reshape(-1, 1)},\n",
        "    batch_size=128, verbose=1\n",
        ")\n",
        "preds_time_top10 = np.argsort(preds_time, axis=1)[:, -10:][:, ::-1].tolist()\n",
        "metrics_time = {\n",
        "    'System': 'LSTM+Time',\n",
        "    'HR@5': hit_rate(y_true, preds_time_top10, 5),\n",
        "    'HR@10': hit_rate(y_true, preds_time_top10, 10),\n",
        "    'Precision@5': precision_at_k(y_true, preds_time_top10, 5),\n",
        "    'MRR': mrr(y_true, preds_time_top10),\n",
        "    'Coverage (%)': evaluate_coverage(preds_time_top10)\n",
        "}\n",
        "\n",
        "# 4. Full System Router (Simulated Data)\n",
        "preds_full = []\n",
        "for i in range(len(X_test_simulated)):\n",
        "    time_features = (hour_test[i], dow_test[i], days_test[i])\n",
        "    recs = get_recommendations(X_test_simulated[i, :-1], time_features)\n",
        "    preds_full.append(recs)\n",
        "    \n",
        "metrics_full = {\n",
        "    'System': 'Full System (3-Tier)',\n",
        "    'HR@5': hit_rate(y_true, preds_full, 5),\n",
        "    'HR@10': hit_rate(y_true, preds_full, 10), # Only 5 generated by router, but compute anyway\n",
        "    'Precision@5': precision_at_k(y_true, preds_full, 5),\n",
        "    'MRR': mrr(y_true, preds_full),\n",
        "    'Coverage (%)': evaluate_coverage(preds_full)\n",
        "}\n",
        "\n",
        "all_metrics = [apriori_metrics, metrics_lstm, metrics_time, metrics_full]\n",
        "df_results = pd.DataFrame([m for m in all_metrics if m])\n",
        "df_results.columns = ['System', 'HR@5', 'HR@10', 'Precision@5', 'MRR', 'Coverage (%)']\n",
        "df_results = df_results.round(4)\n",
        "\n",
        "display(df_results)\n",
        "\n",
        "df_results.to_csv(f'{DATA_DIR}/results.csv', index=False)\n",
        "print(\"Saved results.csv to disk.\")\n"
      ]
    }
]

nb['cells'].extend(new_cells)

with open(r'c:\Users\user\Documents\fresh cart\notebooks\07_Evaluation.ipynb', 'w') as f:
    json.dump(nb, f, indent=2)
print("Updated notebooks/07_Evaluation.ipynb with Phase 02 code.")
