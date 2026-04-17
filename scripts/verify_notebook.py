import json

nb = json.load(open('notebooks/06_Cold_Start.ipynb'))
src = ' '.join(''.join(c.get('source', [])) for c in nb.get('cells', []))

checks = ['get_user_tier', 'recommend_tier1', 'recommend_tier2', 'recommend_tier3',
          'get_recommendations', 'product_aisles', 'global_top20', 'aisle_top10',
          'hits_at_k', 'tier1_metrics', 'tier2_metrics', 'tier3_metrics',
          'new_user_01', 'neha_gupta', 'SC-3', 'SC-4', 'demo_users']

missing = [k for k in checks if k not in src]
assert not missing, f'Missing in notebook: {missing}'
cell_count = len(nb['cells'])
print(f'Notebook cells: {cell_count}')
print('All required content verified [OK]')
