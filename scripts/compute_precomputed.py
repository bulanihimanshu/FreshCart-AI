import pandas as pd
import numpy as np
import json
import os

DATA_DIR = 'data/processed'
PRECOMPUTED_DIR = 'data/precomputed'
os.makedirs(PRECOMPUTED_DIR, exist_ok=True)

print('Loading data...')
orders = pd.read_csv(f'{DATA_DIR}/orders_subset.csv')
order_products = pd.read_csv(f'{DATA_DIR}/order_products_subset.csv')
products = pd.read_csv(f'{DATA_DIR}/products.csv')
aisles = pd.read_csv(f'{DATA_DIR}/aisles.csv')

print(f'Orders: {orders.shape}')
print(f'Order-Products: {order_products.shape}')
print(f'Products: {products.shape}')
print(f'Columns - orders: {orders.columns.tolist()}')
print(f'Columns - order_products: {order_products.columns.tolist()}')
print(f'Columns - products: {products.columns.tolist()}')

# ---- global_top20 ----
product_counts = order_products['product_id'].value_counts()
global_top20 = [int(x) for x in product_counts.head(20).index.tolist()]
with open(f'{PRECOMPUTED_DIR}/global_top20.json', 'w') as f:
    json.dump(global_top20, f)
print(f'global_top20: {global_top20}')

# ---- Join orders with order_products for time context ----
op_with_time = order_products.merge(
    orders[['order_id', 'order_hour_of_day', 'order_dow']],
    on='order_id'
)

# ---- hourly_top10 ----
hourly_top10 = {}
for hour in range(24):
    hour_products = op_with_time[op_with_time['order_hour_of_day'] == hour]
    top10 = [int(x) for x in hour_products['product_id'].value_counts().head(10).index.tolist()]
    hourly_top10[str(hour)] = top10
with open(f'{PRECOMPUTED_DIR}/hourly_top10.json', 'w') as f:
    json.dump(hourly_top10, f)
sample_hour = hourly_top10['10']
print(f'hourly_top10: 24 hours, sample hour 10: {sample_hour}')

# ---- dow_top10 ----
dow_top10 = {}
for dow in range(7):
    dow_products = op_with_time[op_with_time['order_dow'] == dow]
    top10 = [int(x) for x in dow_products['product_id'].value_counts().head(10).index.tolist()]
    dow_top10[str(dow)] = top10
with open(f'{PRECOMPUTED_DIR}/dow_top10.json', 'w') as f:
    json.dump(dow_top10, f)
sample_dow = dow_top10['0']
print(f'dow_top10: 7 days, sample day 0: {sample_dow}')

# ---- aisle_top10 ----
op_with_aisle = order_products.merge(products[['product_id', 'aisle_id']], on='product_id')
aisle_top10 = {}
for aisle_id in sorted(op_with_aisle['aisle_id'].unique()):
    aisle_products = op_with_aisle[op_with_aisle['aisle_id'] == aisle_id]
    top10 = [int(x) for x in aisle_products['product_id'].value_counts().head(10).index.tolist()]
    aisle_top10[str(int(aisle_id))] = top10
with open(f'{PRECOMPUTED_DIR}/aisle_top10.json', 'w') as f:
    json.dump(aisle_top10, f)
print(f'aisle_top10: {len(aisle_top10)} aisles')

print()
print('=== VALIDATION ===')
g = json.load(open(f'{PRECOMPUTED_DIR}/global_top20.json'))
assert isinstance(g, list) and len(g) == 20 and all(isinstance(x, int) for x in g)
print(f'global_top20.json: {len(g)} product IDs [OK]')

h = json.load(open(f'{PRECOMPUTED_DIR}/hourly_top10.json'))
assert len(h) == 24 and all(str(i) in h for i in range(24)) and all(len(v) == 10 for v in h.values())
print(f'hourly_top10.json: {len(h)} hours x 10 products [OK]')

d = json.load(open(f'{PRECOMPUTED_DIR}/dow_top10.json'))
assert len(d) == 7 and all(str(i) in d for i in range(7)) and all(len(v) == 10 for v in d.values())
print(f'dow_top10.json: {len(d)} days x 10 products [OK]')

a = json.load(open(f'{PRECOMPUTED_DIR}/aisle_top10.json'))
assert len(a) >= 10 and all(len(v) <= 10 for v in a.values()) and all(isinstance(pid, int) for v in a.values() for pid in v)
print(f'aisle_top10.json: {len(a)} aisles, up to 10 products each [OK]')

print()
print('All 4 precomputed JSON files validated successfully.')
