import json

file_path = 'notebooks/07_Evaluation.ipynb'

with open(file_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell.get('cell_type') != 'code':
        continue
    source = cell.get('source', [])
    new_source = []
    
    for i, line in enumerate(source):
        # We look for the line where tensorflow is imported
        if "import tensorflow as tf" in line:
            new_source.append(line)
            # Add the GPU disabling code right after
            new_source.append("# Disable GPU globally for inference to bypass CuDNN left-padding constraints\n")
            new_source.append("try:\n")
            new_source.append("    tf.config.set_visible_devices([], 'GPU')\n")
            new_source.append("    print('GPU disabled for inference, running on CPU.')\n")
            new_source.append("except:\n")
            new_source.append("    pass\n")
        else:
            new_source.append(line)
        
    cell['source'] = new_source

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("Notebook GPU disabled globally successfully!")
