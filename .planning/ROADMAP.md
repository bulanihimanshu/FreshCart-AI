# ROADMAP — FreshCart AI
> Milestone 1 · Fine granularity · Sequential execution · 38 requirements → 10 phases

---

## Phase Overview

| # | Phase | Goal | Requirements | Plans |
|---|-------|------|--------------|-------|
| 1 | Data Foundation | Sample Instacart dataset, build project skeleton and folder structure | DATA-01, DEL-02, DEL-03 | 3 |
| 2 | EDA & Preprocessing | Explore data patterns, build item sequences, vocabulary, and train/val/test splits | ML-01, ML-02, DATA-02 | 3 |
| 3 | Apriori Baseline | Implement and evaluate the Apriori association rule baseline | ML-03 | 3 |
| 4 | LSTM Core Model | Build stacked LSTM from scratch in Keras, train on GPU, evaluate | ML-04 | 4 |
| 5 | Time-Aware LSTM | 1/3 | In Progress|  |
| 6 | Cold Start System | Build 3-tier cold start logic and precompute all lookup tables | ML-06 | 3 |
| 7 | Full Evaluation | Run complete 4-system comparison, generate results and charts | ML-07 | 3 |
| 8 | FastAPI Backend | Build entire backend: auth, recommend, products, user endpoints, CORS | API-01–09, AUTH-01, AUTH-02, PROF-01, PROF-02 | 5 |
| 9 | React Frontend | Build all 4 pages: Login, Shop, Cart, Settings with full state management | AUTH-03, AUTH-04, AUTH-06, SHOP-01–05, CART-01–04, SET-01–06, REC-01–06 | 6 |
| 10 | Integration & Delivery | Connect frontend to live backend, test all 5 demo users, finalize repo | DEL-01 | 3 |

---

## Phase Details

### Phase 1: Data Foundation

**Goal:** Set up the full project folder structure matching the PRD spec, install dependencies, and produce the 10K Instacart user subset ready for notebooks.
**Requirements:** DATA-01, DEL-02, DEL-03
**UI hint**: no

**Plans:**
1. Create project skeleton — all directories per PRD spec (`data/`, `notebooks/`, `backend/`, `frontend/`, `scripts/`, `professor_scripts/`)
2. Write `scripts/sampling.py` — samples 10K users from raw Instacart CSVs, saves subset to `data/processed/`
3. Write `requirements.txt` and `.gitignore` — pin Python dependencies, exclude `data/raw/` and large binaries

**Success criteria:**
1. Running `python scripts/sampling.py` completes without error and produces files in `data/processed/`
2. `.gitignore` prevents `data/raw/` from being tracked by git
3. `requirements.txt` installs cleanly with `pip install -r requirements.txt`
4. Project folder structure matches the spec in PRD Section 10

---

### Phase 2: EDA & Preprocessing

**Goal:** Understand the Instacart dataset through exploratory analysis, then build the ML-ready data artifacts: item sequences per user, vocabulary file, and stratified train/val/test splits.
**Requirements:** ML-01, ML-02, DATA-02
**UI hint**: no

**Plans:**
1. `01_EDA.ipynb` — order distribution charts, time-of-day heatmap, top products/aisles analysis, observations summary
2. `02_Preprocessing.ipynb` (sequences + vocab) — build per-user ordered item sequences, construct vocabulary (5,000 items + padding = 5,001), save `vocab.json`
3. `02_Preprocessing.ipynb` (splits) — stratified train/val/test split by user, save `X_train.npz`, `X_val.npz`, `X_test.npz`

**Success criteria:**
1. `01_EDA.ipynb` runs end-to-end with no errors and produces at least 4 charts (order dist, hour heatmap, top-20 products, reorder rate)
2. `vocab.json` contains exactly 5,001 entries (5,000 product IDs + 1 padding token)
3. Train/val/test split is user-stratified (same user's orders don't appear in multiple splits)
4. `X_train.npz` loads successfully and contains padded integer sequences of the correct vocabulary

---

### Phase 3: Apriori Baseline

**Goal:** Implement the Apriori algorithm baseline and compute its HR@K scores — this becomes the benchmark all subsequent models are measured against.
**Requirements:** ML-03
**UI hint**: no

**Plans:**
1. `03_Apriori_Baseline.ipynb` (rule mining) — install mlxtend, build transaction matrix from orders, mine association rules with configurable min_support and min_confidence
2. `03_Apriori_Baseline.ipynb` (evaluation) — compute HR@5, HR@10, Precision@5, MRR on test set; save `baseline_results.csv`
3. Summarize baseline findings — document Apriori's limitations (order-blindness, no personalization, cold start failure) as a comparison narrative

**Success criteria:**
1. `03_Apriori_Baseline.ipynb` runs end-to-end and produces `baseline_results.csv` with HR@5, HR@10, Precision@5, MRR columns
2. HR@5 baseline score is computed and documented (expected ~0.33 per PRD)
3. Apriori's 5 limitations (from PRD Section 1.2) are documented in a notebook markdown cell

---

### Phase 4: LSTM Core Model

**Goal:** Design, implement, train, and evaluate a stacked 2-layer LSTM recommendation model from scratch in Keras — the primary ML innovation of the project.
**Requirements:** ML-04
**UI hint**: no

**Plans:**
1. `04_LSTM_Model.ipynb` (architecture) — implement `LSTMRecommender` class: Embedding(5001, 128) → LSTM(256, return_sequences=True) → LSTM(256) → Dropout(0.3) → Dense(5001, softmax)
2. `04_LSTM_Model.ipynb` (training) — data generator/dataset pipeline, Adam optimizer (lr=0.001), SparseCategoricalCrossentropy loss, EarlyStopping(patience=3), train for up to 20 epochs on Colab T4 GPU; plot training curves
3. `04_LSTM_Model.ipynb` (evaluation + saving) — compute HR@5, HR@10, Precision@5, MRR on test set; compare to Apriori baseline; save `saved_models/lstm_model.h5`
4. Validation checkpoint — verify HR@5 > Apriori baseline (~0.33 target); document improvement

**Success criteria:**
1. `LSTMRecommender` class defined with correct architecture (2 LSTM layers, 128-dim embedding, 256-dim hidden, Dropout 0.3)
2. Model trains to completion (EarlyStopping or 20 epochs) on Colab GPU without OOM errors
3. `saved_models/lstm_model.h5` exists and loads correctly with `tf.keras.models.load_model()`
4. LSTM HR@5 > Apriori HR@5 (expected ~0.51 vs ~0.33)
5. Training curves (loss, HR@K vs epoch) plotted and saved

---

### Phase 5: Time-Aware LSTM

**Goal:** Extend the LSTM with temporal context embeddings (hour-of-day, day-of-week, days-since-last-order) to demonstrate Innovation 2 — time-aware recommendations.
**Requirements:** ML-05
**UI hint**: no

**Plans:**
1/3 plans executed
2. `05_Time_Features.ipynb` (retraining) — update data pipeline to include temporal features per sequence, retrain model with EarlyStopping; save `saved_models/lstm_time_model.h5`
3. `05_Time_Features.ipynb` (comparison) — compute updated HR@5/HR@10/MRR; generate comparison table (Apriori vs LSTM vs LSTM+Time); document improvement

**Success criteria:**
1. Time embedding architecture correctly produces 288-dim vector (256 LSTM + 32 time)
2. `saved_models/lstm_time_model.h5` saved and loadable
3. LSTM+Time HR@5 > LSTM-only HR@5 (expected ~0.57 vs ~0.51)
4. Comparison table shows all 3 systems side-by-side with metric improvements documented

---

### Phase 6: Cold Start System

**Goal:** Build the 3-tier cold start routing logic and pre-compute all lookup tables that power Tiers 1 and 2 — enabling recommendations for users with zero or minimal order history.
**Requirements:** ML-06
**UI hint**: no

**Plans:**
1. `06_Cold_Start.ipynb` (Tier 1 + 2 precomputation) — compute `global_top20.json` (top 20 products globally), `hourly_top10.json` (top 10 by hour), `dow_top10.json` (top 10 by day-of-week), `aisle_top10.json` (top 10 per aisle); save to `data/precomputed/`
2. `06_Cold_Start.ipynb` (tier routing) — implement `get_user_tier(order_count)` function: 0 → Tier 1, 1–2 → Tier 2, 3+ → Tier 3; implement tier-specific recommendation functions
3. `06_Cold_Start.ipynb` (evaluation) — evaluate each tier's recommendation quality against held-out test users in that tier's range; document tier-specific HR@K

**Success criteria:**
1. All 4 precomputed JSON files exist in `data/precomputed/` and are valid JSON
2. `get_user_tier(0)` → 1, `get_user_tier(2)` → 2, `get_user_tier(6)` → 3
3. Tier 1 recommendations for `new_user_01` return 20 globally popular items correctly
4. Tier 2 recommendations for `neha_gupta` (order_count=2) return aisle-affinity items
5. Tier 3 correctly routes to the LSTM+Time model

---

### Phase 7: Full Evaluation

**Goal:** Run a complete 4-system evaluation comparing all models on the full held-out test set, producing the final metrics table and bar chart for the project report.
**Requirements:** ML-07
**UI hint**: no

**Plans:**
1. `07_Evaluation.ipynb` (test harness) — build unified evaluation pipeline that runs all 4 systems (Apriori, LSTM, LSTM+Time, Full System with cold start) on 1,000 test users
2. `07_Evaluation.ipynb` (metrics) — compute HR@5, HR@10, Precision@5, MRR for all 4 systems; format comparison table matching PRD Section 12.3 template; save `results.csv`
3. `07_Evaluation.ipynb` (visualization) — generate bar chart comparing all 4 systems across all metrics; save `metrics_comparison.png`

**Success criteria:**
1. All 4 systems evaluated on the same 1,000 test users (consistent evaluation)
2. `results.csv` contains rows for all 4 systems with HR@5, HR@10, Precision@5, MRR columns
3. `metrics_comparison.png` saved and visually shows progressive improvement from Apriori → Full System
4. Full System HR@5 > LSTM+Time HR@5 > LSTM-only HR@5 > Apriori HR@5

---

### Phase 8: FastAPI Backend

**Goal:** Build the complete Python FastAPI backend — all 7 endpoints, model loading, 3-tier cold start routing, CORS configuration, and professor demo scripts.
**Requirements:** API-01, API-02, API-03, API-04, API-05, API-06, API-07, API-08, API-09, AUTH-01, AUTH-02, PROF-01, PROF-02
**UI hint**: no

**Plans:**
1. `backend/main.py` + structure — FastAPI app with CORS, router registration, startup event that loads `lstm_time_model.h5`, `vocab.json`, and all precomputed JSON tables once at boot
2. Auth endpoints — `api/auth.py`: `POST /api/auth/login` validates `users.json`, returns user info + tier; `POST /api/auth/logout` returns success
3. Recommend endpoint — `api/recommend.py`: `POST /api/recommend` accepts cart_items + time context, calls `cold_start.py` tier router → returns top-5 recommendations + `tier_used`
4. Product + user endpoints — `api/products.py`: `GET /api/products?query=` substring search, `GET /api/products/{id}`; `api/user.py`: `GET /api/user/{user_id}`; `GET /api/health`
5. Professor scripts — `professor_scripts/run_evaluation.py` (full metrics table + CSV + chart) and `professor_scripts/run_model_comparison.py` (side-by-side Apriori vs LSTM, configurable via CLI flags)

**Success criteria:**
1. `uvicorn backend.main:app --reload` starts without errors and loads the LSTM model
2. `POST /api/auth/login` with `raj_sharma / demo1234` returns `{ user_id: 1, tier: 3 }`
3. `POST /api/auth/login` with wrong password returns HTTP 401
4. `POST /api/recommend` with `user_id=5` (new_user_01, Tier 1) returns global popular items
5. `POST /api/recommend` with `user_id=1` (raj_sharma, Tier 3) returns LSTM-personalized items
6. `GET /api/products?query=milk` returns at least 1 matching product
7. `python professor_scripts/run_evaluation.py` completes and prints the comparison table

---

### Phase 9: React Frontend

**Goal:** Build the complete 4-page React grocery shopping app — Login, Shop, Cart, and Settings — with all state management, API integration, and live LSTM recommendations.
**Requirements:** AUTH-03, AUTH-04, AUTH-06, SHOP-01, SHOP-02, SHOP-03, SHOP-04, SHOP-05, CART-01, CART-02, CART-03, CART-04, SET-01, SET-02, SET-03, SET-04, SET-05, SET-06, REC-01, REC-02, REC-03, REC-04, REC-05, REC-06
**UI hint**: yes

**Plans:**
1. Project setup + context layer — `create-react-app` / Vite init with Tailwind CSS; implement `AuthContext`, `CartContext`, `TimeContext`; set up React Router with `/login`, `/shop`, `/cart`, `/settings` routes; `api/client.js` with all Axios calls
2. Login page — `LoginPage.jsx`: username + password form, error message on 401, redirect to `/shop` on success, session persisted to localStorage via AuthContext
3. Shop page — `ShopPage.jsx`: 3-column layout (Sidebar categories, ProductGrid with SearchBar, SuggestionPanel); `CategoryFilter.jsx` filters product grid; `ProductCard.jsx` with qty stepper; `SearchBar.jsx` with 300ms debounce and dropdown
4. Cart page + Settings page — `CartPage.jsx`: cart item list with qty steppers + remove, CartSummary panel, ForgottenItems LSTM section; `SettingsPage.jsx`: HourSlider, DaySelector, DaysGapInput, "Use current time" button, Account section with logout
5. Recommendations integration — `SuggestionPanel.jsx` (right sidebar, live on cart change), `SuggestionCard.jsx`, `ForgottenItems.jsx` (cart page); `useRecommendations.js` hook re-fires on cart or time context change; heading text changes by tier (REC-03)
6. Polish + Navbar — `Navbar.jsx` (logo, cart icon with item count, settings link); loading states, error boundaries, empty states for all pages; ensure all 5 demo user flows work correctly

**Success criteria:**
1. Logging in as `new_user_01` succeeds and shows "Popular right now" in the suggestion panel
2. Logging in as `raj_sharma` succeeds and shows "Suggested for you" in the suggestion panel
3. Adding a product to cart triggers a new recommendation fetch and updates the suggestion panel
4. Cart page shows "You might have forgotten…" section with 5 suggestion cards, each with an Add button
5. Changing hour slider in Settings and navigating back to Shop shows updated recommendations
6. Logout from Settings clears session and redirects to Login page

---

### Phase 10: Integration & Delivery

**Goal:** Connect the running frontend to the live backend, verify all 5 demo users end-to-end, and finalize the GitHub repo with README and documentation.
**Requirements:** DEL-01
**UI hint**: no

**Plans:**
1. End-to-end integration testing — run backend + frontend simultaneously; test all 5 demo users (new_user_01 → Tier 1, neha_gupta → Tier 2, arjun_nair/priya_mehta/raj_sharma → Tier 3); verify correct tier labels and recommendation quality per user
2. Professor demo walkthrough — validate both professor scripts run from terminal; verify time-context demo (change Settings day/hour → recommendations update); document the exact demo steps from PRD Sections 3.2 and 4.4
3. `README.md` + repo finalization — write README with: project overview, setup instructions (data download, pip install, model training, backend start, frontend start), demo users table, professor script commands, and expected output screenshots

**Success criteria:**
1. Full app runs with `uvicorn` backend + React frontend simultaneously without CORS errors
2. All 5 demo users log in successfully and receive correct-tier recommendations
3. "Popular right now" label visible for `new_user_01`, "Suggested for you" visible for `raj_sharma`
4. Both professor scripts run from terminal and produce correct output
5. `README.md` contains setup instructions, demo users table, and professor script usage

---

## Requirement Traceability

| REQ-ID | Phase | Phase Name |
|--------|-------|------------|
| DATA-01 | 1 | Data Foundation |
| DATA-02 | 2 | EDA & Preprocessing |
| DEL-02 | 1 | Data Foundation |
| DEL-03 | 1 | Data Foundation |
| ML-01 | 2 | EDA & Preprocessing |
| ML-02 | 2 | EDA & Preprocessing |
| ML-03 | 3 | Apriori Baseline |
| ML-04 | 4 | LSTM Core Model |
| ML-05 | 5 | Time-Aware LSTM |
| ML-06 | 6 | Cold Start System |
| ML-07 | 7 | Full Evaluation |
| API-01 | 8 | FastAPI Backend |
| API-02 | 8 | FastAPI Backend |
| API-03 | 8 | FastAPI Backend |
| API-04 | 8 | FastAPI Backend |
| API-05 | 8 | FastAPI Backend |
| API-06 | 8 | FastAPI Backend |
| API-07 | 8 | FastAPI Backend |
| API-08 | 8 | FastAPI Backend |
| API-09 | 8 | FastAPI Backend |
| AUTH-01 | 8 | FastAPI Backend |
| AUTH-02 | 8 | FastAPI Backend |
| PROF-01 | 8 | FastAPI Backend |
| PROF-02 | 8 | FastAPI Backend |
| AUTH-03 | 9 | React Frontend |
| AUTH-04 | 9 | React Frontend |
| AUTH-06 | 9 | React Frontend |
| SHOP-01 | 9 | React Frontend |
| SHOP-02 | 9 | React Frontend |
| SHOP-03 | 9 | React Frontend |
| SHOP-04 | 9 | React Frontend |
| SHOP-05 | 9 | React Frontend |
| CART-01 | 9 | React Frontend |
| CART-02 | 9 | React Frontend |
| CART-03 | 9 | React Frontend |
| CART-04 | 9 | React Frontend |
| SET-01 | 9 | React Frontend |
| SET-02 | 9 | React Frontend |
| SET-03 | 9 | React Frontend |
| SET-04 | 9 | React Frontend |
| SET-05 | 9 | React Frontend |
| SET-06 | 9 | React Frontend |
| REC-01 | 9 | React Frontend |
| REC-02 | 9 | React Frontend |
| REC-03 | 9 | React Frontend |
| REC-04 | 9 | React Frontend |
| REC-05 | 9 | React Frontend |
| REC-06 | 9 | React Frontend |
| DEL-01 | 10 | Integration & Delivery |
