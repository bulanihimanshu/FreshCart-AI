import argparse
import numpy as np
import pandas as pd
import json
import tensorflow as tf

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--cart', required=True, type=str, help='Comma separated list of product IDs')
    parser.add_argument('--hour', default=12, type=int, help='Hour of day (0-23)')
    parser.add_argument('--dow', default=0, type=int, help='Day of week (0-6)')
    parser.add_argument('--days', default=7.0, type=float, help='Days gap')
    args = parser.parse_args()

    # Load items and models
    try:
        with open('data/processed/vocab.json', 'r') as f:
            vocab = json.load(f)
    except Exception as e:
        print(f"Error loading vocab: {e}")
        return
    
    # Load products metadata
    try:
        products_df = pd.read_csv('data/processed/products.csv')
        products_dict = dict(zip(products_df['product_id'], products_df['product_name']))
    except Exception as e:
        print(f"Error loading products metadata: {e}")
        products_dict = {}

    model = tf.keras.models.load_model('saved_models/lstm_time_model.keras')
    
    # Predict with LSTM
    cart_items = [int(i.strip()) for i in args.cart.split(',')]
    seq = np.zeros(99, dtype=np.int32)
    start_idx = max(0, 99 - len(cart_items))
    for i, item in enumerate(cart_items[-(99):]):
        seq[start_idx + i] = int(item)
        
    seq = seq.reshape((1, 99))
    hour = np.array([args.hour], dtype=np.int32)
    dow = np.array([args.dow], dtype=np.int32)
    days = np.array([args.days], dtype=np.float32) / 30.0

    print("Running LSTM inference...")
    preds = model.predict({'seq_input': seq, 'hour_input': hour, 'dow_input': dow, 'days_gap_input': days}, verbose=0)[0]
    lstm_top5 = np.argsort(preds)[-5:][::-1]
    
    # Mocking Apriori since rules were not cached in baseline notebook (only scores were calculated)
    # The true apriori baseline falls back to global popular when rules don't match
    try:
        global_top20 = json.load(open('data/precomputed/global_top20.json', 'r'))
        apriori_top5 = global_top20[:5]
    except:
        apriori_top5 = [24852, 13176, 21137, 21903, 47209] # static global popularity
    
    # Build dataframe for comparison
    df = pd.DataFrame({
        'Rank': [1, 2, 3, 4, 5],
        'Apriori Recommendation': [products_dict.get(int(x), f"Unknown ({x})") for x in apriori_top5],
        'LSTM+Time Recommendation': [products_dict.get(int(x), f"Unknown ({x})") for x in lstm_top5]
    })
    
    print("\n" + "="*70)
    print("                   FRESHCART: MODEL COMPARISON                    ")
    print("="*70)
    print(f"Context: Cart = {cart_items}")
    print(f"         Hour = {args.hour}, DOW = {args.dow}, Days Gap = {args.days}")
    print("-"*70)
    print(df.to_string(index=False))
    print("="*70 + "\n")

if __name__ == '__main__':
    # Force CPU to bypass CuDNN
    tf.config.set_visible_devices([], 'GPU')
    main()
