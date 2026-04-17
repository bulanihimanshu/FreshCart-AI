import json

file_path = 'notebooks/07_Evaluation.ipynb'

with open(file_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell.get('cell_type') != 'code':
        continue
    
    new_source = []
    for line in cell.get('source', []):
        if "apriori_row['HR@5']" in line:
            new_source.append(line.replace("apriori_row['HR@5']", "baseline_dict.get('HR@5', 0.0)"))
        elif "apriori_row['HR@10']" in line:
            new_source.append(line.replace("apriori_row['HR@10']", "baseline_dict.get('HR@10', 0.0)"))
        elif "apriori_row['Precision@5']" in line:
            new_source.append(line.replace("apriori_row['Precision@5']", "baseline_dict.get('Precision@5', 0.0)"))
        elif "apriori_row['MRR']" in line:
            new_source.append(line.replace("apriori_row['MRR']", "baseline_dict.get('MRR', 0.0)"))
        else:
            # removing 'apriori_row = ...' entirely if it was left over
            if "apriori_row =" in line:
                pass
            else:
                new_source.append(line)
        
    cell['source'] = new_source

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("Notebook apriori_row reference fully updated.")
