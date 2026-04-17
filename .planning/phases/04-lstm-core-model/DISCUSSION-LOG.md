# Discussion Log: Phase 4 (LSTM Core Model)
**Date:** 2026-04-14

### Q1: Padding Support
**Question:** How should the LSTM handle the padded zeroes (from max sequence length 100)?
**Options:**
1. Use `mask_zero=True` in the Embedding layer
2. Add an explicit `Masking` layer before the LSTM
3. No masking, just let the model learn to ignore zero tokens
**User Answer:** 1

### Q2: Data Pipeline Design
**Question:** How should we construct the data loader?
**Options:**
1. `tf.data.Dataset.from_tensor_slices`
2. Subclass `keras.utils.Sequence`
3. Just pass the numpy arrays directly to `model.fit(X, y)`
**User Answer:** 3

### Q3: Colab Data Workflow
**Question:** You will need to train this on a Colab GPU. How do you plan to load `X_train.npz` and `vocab.json` into Colab?
**Options:**
1. Connect via Google Drive Mount (`from google.colab import drive`)
2. Use Colab's manual upload widget in a cell
3. `!git clone` the repository inside Colab
**User Answer:** 1

### Q4: Training Batch Size
**Question:** What batch size should we target for the Colab T4 GPU?
**Options:**
1. `512`
2. `1024`
3. `256`
**User Answer:** 1
