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
        # 1. Router Logic
        if "preds = lstm_time_model.predict({'seq_input': seq_in" in line:
            new_source.append("        with tf.device('/CPU:0'):\n")
            # add indentation to current line
            new_source.append("    " + line)
        # 2. Standard LSTM
        elif "preds_lstm = lstm_model.predict(X_test[:, :-1], batch_size=128" in line:
            new_source.append("with tf.device('/CPU:0'):\n")
            new_source.append("    " + line)
        # 3. Time-Aware LSTM
        elif "preds_time = lstm_time_model.predict(" in line:
            new_source.append("with tf.device('/CPU:0'):\n")
            new_source.append("    " + line)
        elif "    {'seq_input': X_test[:, :-1], 'hour_input': hour_test" in line and len(new_source)>0 and "preds_time" in new_source[-1]:
            new_source.append("    " + line)
        elif "    batch_size=128, verbose=1" in line and len(new_source)>0 and "preds_time" in new_source[-1]:
             new_source.append("    " + line)
        elif ")\n" == line and len(new_source)>0 and "preds_time" in new_source[-1]:
             new_source.append("    " + line)
        # For router logic 'top5_idx...' doesn't need to be indented, we can leave it
        # Actually in Time-Aware LSTM, preds_time_top10 line comes right after
        else:
            # We must be careful if we are indenting the multiline predict
            if "    batch_size=128, verbose=1" in line and i > 0 and "preds_time =" in source[i-2]:
                new_source.append("    " + line)
            elif ")\n" == line and i > 0 and "preds_time =" in source[i-3]:
                 new_source.append("    " + line)
            elif "    {'seq_input': X_test[:, :-1]" in line and i > 0 and "preds_time =" in source[i-1]:
                 new_source.append("    " + line)
            else:
                 new_source.append(line)
        
    cell['source'] = new_source

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, indent=2)

print("Notebook updated via JSON parsing!")
