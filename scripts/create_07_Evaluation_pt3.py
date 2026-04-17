import json

with open(r'c:\Users\user\Documents\fresh cart\notebooks\07_Evaluation.ipynb', 'r') as f:
    nb = json.load(f)

new_cells = [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": [
        "## 6. Visualization: Metrics Comparison"
      ]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "execution_count": None,
      "outputs": [],
      "source": [
        "import seaborn as sns\n",
        "import matplotlib.pyplot as plt\n",
        "\n",
        "# For plotting, we compare HR@5, HR@10, Precision@5, MRR. Coverage is removed because its scale is 0-100\n",
        "df_plot = df_results.drop(columns=['Coverage (%)'])\n",
        "\n",
        "# Melt for seaborn grouped bar plot\n",
        "df_melted = df_plot.melt(id_vars='System', var_name='Metric', value_name='Score')\n",
        "\n",
        "sns.set_style(\"darkgrid\")\n",
        "plt.figure(figsize=(12, 6))\n",
        "\n",
        "ax = sns.barplot(data=df_melted, x='Metric', y='Score', hue='System', palette='viridis')\n",
        "\n",
        "plt.title('FreshCart AI: Recommendation Systems Evaluation', fontsize=16, fontweight='bold', pad=15)\n",
        "plt.xlabel('Evaluation Metric', fontsize=12)\n",
        "plt.ylabel('Score (0.0 - 1.0)', fontsize=12)\n",
        "plt.ylim(0, df_melted['Score'].max() * 1.15) # Add headroom for annotations\n",
        "\n",
        "# Add annotations on top of the bars\n",
        "for p in ax.patches:\n",
        "    if p.get_height() > 0:\n",
        "        ax.annotate(f'{p.get_height():.3f}', \n",
        "                    (p.get_x() + p.get_width() / 2., p.get_height()), \n",
        "                    ha='center', va='bottom', \n",
        "                    fontsize=9, color='black', xytext=(0, 5), textcoords='offset points')\n",
        "\n",
        "plt.legend(title='System', bbox_to_anchor=(1.05, 1), loc='upper left')\n",
        "plt.tight_layout()\n",
        "\n",
        "plt.savefig(f'{DATA_DIR}/metrics_comparison.png', dpi=300, bbox_inches='tight')\n",
        "plt.show()\n",
        "\n",
        "print(f\"Saved bar chart to {DATA_DIR}/metrics_comparison.png\")"
      ]
    }
]

nb['cells'].extend(new_cells)

with open(r'c:\Users\user\Documents\fresh cart\notebooks\07_Evaluation.ipynb', 'w') as f:
    json.dump(nb, f, indent=2)
print("Updated notebooks/07_Evaluation.ipynb with Phase 03 code.")
