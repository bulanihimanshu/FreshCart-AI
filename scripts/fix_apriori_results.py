import json

file_path = 'notebooks/07_Evaluation.ipynb'

with open(file_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell.get('cell_type') != 'code':
        continue
    
    source = cell.get('source', [])
    new_source = []
    
    i = 0
    while i < len(source):
        line = source[i]
        
        # Replace Data Loading part
        if "baseline_results = pd.read_csv(f'{DATA_DIR}/baseline_metrics.csv')" in line:
            new_source.append("    baseline_df = pd.read_csv(f'{DATA_DIR}/baseline_results.csv')\n")
            new_source.append("    baseline_dict = dict(zip(baseline_df['metric'], baseline_df['value']))\n")
            i += 1
            continue
            
        if "baseline_results = None" in line:
            new_source.append("    baseline_dict = None\n")
            i += 1
            continue
        
        # Replace Batch Scoring part
        if "if baseline_results is not None:" in line:
            new_source.append("if baseline_dict is not None:\n")
            i += 1
            # Skip the next line which is apriori_row = ...
            if i < len(source) and "apriori_row = " in source[i]:
                i += 1
            continue
            
        if "'HR@5': apriori_row['HR@5'],\n" == line:
            new_source.append("        'HR@5': baseline_dict.get('HR@5', 0.0),\n")
            i += 1
            continue
            
        if "'HR@10': apriori_row['HR@10'],\n" == line:
            new_source.append("        'HR@10': baseline_dict.get('HR@10', 0.0),\n")
            i += 1
            continue

        if "'Precision@5': apriori_row['Precision@5'],\n" == line:
            new_source.append("        'Precision@5': baseline_dict.get('Precision@5', 0.0),\n")
            i += 1
            continue

        if "'MRR': apriori_row['MRR'],\n" == line:
            new_source.append("        'MRR': baseline_dict.get('MRR', 0.0),\n")
            i += 1
            continue
            
        new_source.append(line)
        i += 1
        
    cell['source'] = new_source

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("Notebook updated to use baseline_results.csv appropriately.")
