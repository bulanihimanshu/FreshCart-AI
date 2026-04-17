# REQUIREMENTS.md — FreshCart AI

> v1 scope defined 2026-04-11 from FreshCart_AI_PRD_v2.0

---

## v1 Requirements

### DATA — Data Pipeline & Preprocessing

- [ ] **DATA-01**: User can run `scripts/sampling.py` to produce a 10K user subset from raw Instacart CSVs, saved to `data/processed/`
- [ ] **DATA-02**: Preprocessing notebook builds per-user item sequences, a vocabulary file (`vocab.json`), and train/val/test splits by user (`X_train.npz`, `X_test.npz`)

---

### ML — Jupyter Notebooks (7 total)

- [ ] **ML-01**: `01_EDA.ipynb` — produces order distribution charts, time heatmap, and top-products analysis from the processed subset
- [ ] **ML-02**: `02_Preprocessing.ipynb` — builds sequences, vocabulary, and user-stratified train/val/test splits; outputs `vocab.json` and `.npz` files
- [x] **ML-03**: `03_Apriori_Baseline.ipynb` — generates Apriori association rules, computes HR@K score, saves `baseline_results.csv`
- [ ] **ML-04**: `04_LSTM_Model.ipynb` — implements a stacked 2-layer LSTM (128-dim embedding, 256-dim hidden, Dropout 0.3) from scratch in Keras; trains on Colab GPU; saves `saved_models/lstm_model.h5`
- [x] **ML-05**: `05_Time_Features.ipynb` — adds hour-of-day (Embedding 24→16), day-of-week (Embedding 7→8), and days-since-last-order (normalized → Dense 8) embeddings concatenated to LSTM output; retrains; saves `lstm_time_model.h5` with improved HR@K
- [ ] **ML-06**: `06_Cold_Start.ipynb` — implements and evaluates 3-tier cold start system; generates precomputed lookup tables (`global_top20.json`, `hourly_top10.json`, `dow_top10.json`, `aisle_top10.json`)
- [ ] **ML-07**: `07_Evaluation.ipynb` — runs full comparison of all 4 systems (Apriori, LSTM, LSTM+Time, Full System) on held-out test users; produces `results.csv` and a comparison bar chart

---

### AUTH — Authentication & Session

- [x] **AUTH-01**: User can log in with username + password on the Login page; frontend POSTs to `POST /api/auth/login`
- [x] **AUTH-02**: Backend validates credentials against `users.json` and returns `{ user_id, display_name, order_count, tier }` on success
- [ ] **AUTH-03**: Frontend stores `user_id`, `display_name`, `order_count`, and `tier` in React state (+ localStorage for persistence across page refreshes)
- [ ] **AUTH-04**: User can log out from the Settings page; session state is cleared and user is redirected to the Login page
- [ ] **AUTH-06**: User sees an error message on the Login page when username or password is incorrect

---

### SHOP — Shopping & Product Browsing

- [ ] **SHOP-01**: User can browse products in a grid on the Shop page; clicking a category in the left sidebar filters the grid to that category
- [ ] **SHOP-02**: User can type in a debounced search bar (300ms delay) and see a dropdown of matching products by name
- [ ] **SHOP-03**: Clicking a product in the search dropdown adds it to the cart and closes the dropdown
- [ ] **SHOP-04**: Each product card in the grid shows a product image/icon, name, aisle/category tag, and an "Add to Cart" button
- [ ] **SHOP-05**: Once a product is in the cart, its "Add to Cart" button becomes a quantity stepper (+/−)

---

### REC — LSTM Recommendations

- [ ] **REC-01**: Shop page displays a "Suggested for You" panel in the right sidebar showing 5 live recommendations
- [ ] **REC-02**: Recommendation panel refetches via `POST /api/recommend` in real time whenever the cart contents change
- [ ] **REC-03**: Suggestion panel heading reflects the user's cold start tier — "Popular right now" (Tier 1), "You might also like" (Tier 2), "Suggested for you" (Tier 3)
- [ ] **REC-04**: Cart page displays a "You might have forgotten…" section at the bottom with 5 LSTM recommendations based on full cart contents
- [ ] **REC-05**: Each suggestion card on both Shop and Cart pages has a quick "Add" button that adds the item directly to the cart
- [ ] **REC-06**: When the user changes any time setting in Settings, the next recommendation fetch includes the updated hour/DOW/days_gap values

---

### CART — Cart Management

- [ ] **CART-01**: User can view all cart items on the Cart page, each showing product name, quantity, and price
- [ ] **CART-02**: User can increase or decrease item quantity with +/− steppers, or remove items entirely from the cart
- [ ] **CART-03**: Cart summary panel shows subtotal, estimated delivery fee, and a checkout button (UI display only — no payment flow)
- [ ] **CART-04**: Empty cart state displays an illustration and a "Start Shopping" button that navigates back to the Shop page

---

### SET — Settings & Time Context

- [ ] **SET-01**: User can adjust Hour of Day (0–23) via a slider with contextual labels (Morning, Afternoon, Evening, Night)
- [ ] **SET-02**: User can select Day of Week via a 7-button toggle (Mon–Sun), with one active at a time
- [ ] **SET-03**: User can set Days Since Last Order via a number input (1–30) or preset buttons (1 day, 1 week, 1 month)
- [ ] **SET-04**: "Use current time" button auto-fills the hour slider and day-of-week toggle from the user's actual local time
- [ ] **SET-05**: Settings page shows the logged-in user's username and display name in an Account section
- [ ] **SET-06**: Logout button on the Settings page clears the session and redirects to the Login page

---

### API — FastAPI Backend

- [ ] **API-01**: `POST /api/auth/login` — accepts `{ username, password }`, validates against `users.json`, returns `{ user_id, display_name, order_count, tier }` or 401 on failure
- [ ] **API-02**: `POST /api/auth/logout` — accepts `{ user_id }`, clears server-side session if any, returns `{ success: true }`
- [ ] **API-03**: `POST /api/recommend` — accepts `{ user_id, cart_items[], hour, dow, days_gap }`, routes through 3-tier cold start logic, returns `{ recommendations: [{product_id, name, score}], tier_used }`
- [ ] **API-04**: `GET /api/products?query=&limit=` — returns products matching the query string by name, up to the specified limit
- [ ] **API-05**: `GET /api/products/{id}` — returns a single product's `{ product_id, name, aisle, department }`
- [ ] **API-06**: `GET /api/user/{user_id}` — returns `{ user_id, display_name, order_count, tier }` for a given user
- [x] **API-07**: `GET /api/health` — returns `{ status: "ok" }` for uptime checks
- [x] **API-08**: LSTM model weights and vocab are loaded once at FastAPI startup and reused across all requests (no per-request cold loading)
- [x] **API-09**: CORS is configured to allow requests from the React dev server origin

---

### PROF — Professor Demo Scripts

- [ ] **PROF-01**: `professor_scripts/run_evaluation.py` — loads all 3 systems, runs against 1K held-out test users, prints a formatted HR@5/HR@10/Precision@5/Precision@10/MRR comparison table, saves `results.csv` and `metrics_comparison.png`
- [ ] **PROF-02**: `professor_scripts/run_model_comparison.py` — shows side-by-side Apriori vs LSTM recommendations for a sample cart sequence; configurable via `--cart`, `--hour`, `--dow` CLI flags; optionally saves an HTML report

---

### DEL — Deliverables & Repo

- [ ] **DEL-01**: GitHub repository contains a `README.md` with setup instructions, demo user credentials table, and professor script usage
- [ ] **DEL-02**: `.gitignore` excludes `data/raw/` (Kaggle CSVs) and any locally large binary artifacts
- [ ] **DEL-03**: `requirements.txt` lists all Python dependencies with pinned versions

---

## v2 Requirements (Deferred)

- Full 200K Instacart user dataset training (v1 uses 10K subset)
- Saved model versioning / model registry
- Live retraining trigger from UI
- Real-time collaborative filtering layer
- User-facing metrics dashboard (HR@K, MRR visible in app)

---

## Out of Scope

- **JWT / OAuth authentication** — Session-based demo auth is sufficient; full auth adds complexity with no demo value
- **Real payment / checkout** — The checkout button is UI-only; no order processing, payment gateway, or fulfillment
- **User registration** — Only the 5 pre-seeded demo users exist; open signup would break cold-start tier assumptions
- **Apriori in the frontend** — Apriori comparison is professor-scripts only; the shopping app always uses the LSTM/cold-start system
- **Real product images** — Icon/placeholder images by category are acceptable; sourcing real Instacart product images adds unnecessary overhead
- **Cloud deployment / production hosting** — Local demo environment is the target; Heroku/Vercel/AWS deployment is out of scope
- **Mobile-native app** — React web app only; no React Native or PWA offline support required
- **Social / sharing features** — Cart sharing, wishlists, or social recommendations are not relevant to the ML demonstration goals
- **Model serving infrastructure** — No Docker, Kubernetes, or model-serving frameworks (TorchServe, TF Serving); plain FastAPI + Uvicorn load is sufficient

---

## Traceability

> Populated by roadmapper — maps each REQ-ID to the phase it is delivered in.

| REQ-ID | Phase | Phase Name | Status |
|--------|-------|------------|--------|
| DATA-01 | 1 | Data Foundation | ☐ |
| DEL-02 | 1 | Data Foundation | ☐ |
| DEL-03 | 1 | Data Foundation | ☐ |
| ML-01 | 2 | EDA & Preprocessing | ☐ |
| ML-02 | 2 | EDA & Preprocessing | ☐ |
| DATA-02 | 2 | EDA & Preprocessing | ☐ |
| ML-03 | 3 | Apriori Baseline | ☐ |
| ML-04 | 4 | LSTM Core Model | ☐ |
| ML-05 | 5 | Time-Aware LSTM | ☐ |
| ML-06 | 6 | Cold Start System | ☐ |
| ML-07 | 7 | Full Evaluation | ☐ |
| API-01 | 8 | FastAPI Backend | ☐ |
| API-02 | 8 | FastAPI Backend | ☐ |
| API-03 | 8 | FastAPI Backend | ☐ |
| API-04 | 8 | FastAPI Backend | ☐ |
| API-05 | 8 | FastAPI Backend | ☐ |
| API-06 | 8 | FastAPI Backend | ☐ |
| API-07 | 8 | FastAPI Backend | ☐ |
| API-08 | 8 | FastAPI Backend | ☐ |
| API-09 | 8 | FastAPI Backend | ☐ |
| AUTH-01 | 8 | FastAPI Backend | ☐ |
| AUTH-02 | 8 | FastAPI Backend | ☐ |
| PROF-01 | 8 | FastAPI Backend | ☐ |
| PROF-02 | 8 | FastAPI Backend | ☐ |
| AUTH-03 | 9 | React Frontend | ☐ |
| AUTH-04 | 9 | React Frontend | ☐ |
| AUTH-06 | 9 | React Frontend | ☐ |
| SHOP-01 | 9 | React Frontend | ☐ |
| SHOP-02 | 9 | React Frontend | ☐ |
| SHOP-03 | 9 | React Frontend | ☐ |
| SHOP-04 | 9 | React Frontend | ☐ |
| SHOP-05 | 9 | React Frontend | ☐ |
| CART-01 | 9 | React Frontend | ☐ |
| CART-02 | 9 | React Frontend | ☐ |
| CART-03 | 9 | React Frontend | ☐ |
| CART-04 | 9 | React Frontend | ☐ |
| SET-01 | 9 | React Frontend | ☐ |
| SET-02 | 9 | React Frontend | ☐ |
| SET-03 | 9 | React Frontend | ☐ |
| SET-04 | 9 | React Frontend | ☐ |
| SET-05 | 9 | React Frontend | ☐ |
| SET-06 | 9 | React Frontend | ☐ |
| REC-01 | 9 | React Frontend | ☐ |
| REC-02 | 9 | React Frontend | ☐ |
| REC-03 | 9 | React Frontend | ☐ |
| REC-04 | 9 | React Frontend | ☐ |
| REC-05 | 9 | React Frontend | ☐ |
| REC-06 | 9 | React Frontend | ☐ |
| DEL-01 | 10 | Integration & Delivery | ☐ |
