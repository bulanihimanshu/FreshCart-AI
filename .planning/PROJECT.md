# FreshCart AI

## What This Is

FreshCart AI is a real grocery shopping app (React + FastAPI) powered by an LSTM-based recommendation engine trained on the Instacart Market Basket Dataset. It is a university AI/ML project and portfolio piece that demonstrates three innovations beyond the Apriori baseline: sequential LSTM recommendations, time-aware context embeddings, and a three-tier cold start system — all surfaced naturally within a polished grocery UX. Five pre-seeded demo users with different order histories make the cold start tiers instantly demonstrable.

## Core Value

The LSTM model runs silently in the background and surfaces personalized, time-aware "next item" recommendations at natural moments in the shopping flow — just like a real grocery app — so the AI/ML innovation can be demoed without any technical explanation.

## Requirements

### Validated

<!-- None yet — ship to validate -->

(None yet — ship to validate)

### Active

<!-- ML Pipeline & Data -->
- [ ] Instacart 10K subset sampled and saved to `data/processed/`
- [ ] Seven Jupyter notebooks complete: EDA → Preprocessing → Apriori → LSTM → Time Features → Cold Start → Evaluation
- [ ] Stacked LSTM (2-layer, 128-dim embed, 256-dim hidden, Dropout 0.3) trained from scratch in Keras
- [ ] Time-aware context embeddings (hour 16-dim, DOW 8-dim, days_gap 8-dim) concatenated to LSTM output
- [x] Three-tier cold start system: Tier 1 (global popularity), Tier 2 (category affinity), Tier 3 (full LSTM)
- [ ] Trained model weights saved as `saved_models/lstm_model.h5` and `vocab.json`
- [x] Precomputed lookup tables: `global_top20.json`, `hourly_top10.json`, `dow_top10.json`, `aisle_top10.json`

<!-- Backend -->
- [ ] FastAPI backend with all endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/recommend`, `/api/products`, `/api/user/{id}`, `/api/health`
- [ ] Session-based auth with `users.json` containing 5 pre-seeded demo users
- [ ] Tier detection logic routes to correct cold start strategy per user
- [ ] LSTM model loaded at startup and served via `/api/recommend`
- [ ] Product search endpoint with fuzzy/substring matching
- [ ] Professor scripts: `run_evaluation.py` and `run_model_comparison.py`

<!-- Frontend -->
- [ ] React app with 4 pages: Login, Shop, Cart, Settings
- [ ] Login page: username/password form, demo credentials hint, redirects to Shop on success
- [ ] Shop page: 3-column layout (category sidebar, product grid with search, LSTM suggestion panel)
- [ ] Suggestion panel heading changes by tier: "Popular right now" / "You might also like" / "Suggested for you"
- [ ] Cart page: item list with qty stepper, cart summary, "You might have forgotten" LSTM section
- [ ] Settings page: hour-of-day slider, day-of-week toggle, days-since-last-order input, logout button
- [ ] Real-time suggestions via `GET /api/recommend` — updates on every cart change and time context change
- [ ] Debounced search (300ms) with dropdown results

<!-- Demo & Delivery -->
- [ ] All 5 demo users testable and demonstrating correct cold start tier behavior
- [ ] GitHub repo with README and `.gitignore` for raw data
- [ ] Project report (PDF/Word) using provided framing
- [ ] Professor evaluation scripts runnable from terminal

### Out of Scope

- JWT / OAuth authentication — session-based demo auth is sufficient for the university context
- Real payment / checkout flow — the checkout button is UI-only, no actual order processing
- Real product images — placeholder/icon-based product cards are acceptable
- User registration — only the 5 pre-seeded demo users exist
- Model retraining via the UI — model is pre-trained offline, served as a static `.h5` file
- Production deployment / cloud hosting — local demo is the target environment
- Social / sharing features — not relevant to the ML demonstration goals
- Apriori in the frontend — Apriori is backend/professor-scripts only for comparison

## Context

- **Dataset:** Instacart Market Basket Analysis dataset from Kaggle — 10K user subset used. Key files: `orders.csv`, `order_products__prior.csv`, `products.csv`, `aisles.csv`, `departments.csv`
- **ML Model:** Stacked LSTM written from scratch in Keras (`.ipynb`, not a library). Vocab size 5,001 (5,000 products + padding). Training target: 15–25 mins on Colab T4 GPU
- **Cold Start Tiers:** Tier 1 = 0 orders (global popularity + time), Tier 2 = 1–2 orders (aisle affinity + time), Tier 3 = 3+ orders (full LSTM)
- **Time Features:** Three signals — `order_hour_of_day` (Embedding 24→16), `order_dow` (Embedding 7→8), `days_since_prior_order` (normalized float → Dense 8) — concatenated to 256-dim LSTM output → 288-dim → Dense softmax
- **PRD Version:** v2.0 — frontend revised from "ML demo dashboard" to "real grocery shopping app (FreshCart AI)"
- **Demo Users:** raj_sharma (18 orders, Tier 3), priya_mehta (11 orders, Tier 3), arjun_nair (6 orders, Tier 3), neha_gupta (2 orders, Tier 2), new_user_01 (0 orders, Tier 1) — all password: `demo1234`
- **15-day implementation plan** in PRD — this roadmap aligns to that timeline

## Constraints

- **Tech Stack (ML):** TensorFlow / Keras for LSTM — must be written from scratch (no recommender libraries), trained in Jupyter notebooks
- **Tech Stack (Backend):** Python FastAPI + Uvicorn — already specified in PRD
- **Tech Stack (Frontend):** React.js + Tailwind CSS — already specified in PRD. Axios for HTTP calls
- **Dataset:** Instacart Kaggle data (raw CSVs must be gitignored — too large for repo)
- **Timeline:** 15-day implementation plan — phases prioritize ML pipeline first, then backend, then frontend
- **Auth Simplicity:** No JWT, no OAuth — simple session-based with hardcoded `users.json`
- **Model Training:** GPU required (Google Colab T4 or local) — CPU training is too slow for 20 epochs on this dataset
- **University Context:** Code + Report + GitHub + Live Demo + Professor scripts are all required deliverables

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| LSTM from scratch in Keras (not a library) | University requirement — demonstrates understanding of architecture | — Pending |
| Apriori only in professor scripts, not frontend | Keeps UX clean; comparison shown via terminal, not app | — Pending |
| 5 pre-seeded users instead of open registration | Eliminates cold start ambiguity; each user maps to a precise tier for demos | — Pending |
| 10K user subset of Instacart (not full dataset) | Full dataset too large for student GPU budget; 10K covers all tiers adequately | — Pending |
| Time context in Settings page (not embedded on dashboard) | Separates configuration from shopping flow; makes time-demo explicit for professor | — Pending |
| React + Tailwind CSS (not vanilla CSS) | PRD specifies Tailwind; faster styling, consistent spacing | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-11 after initialization from FreshCart_AI_PRD_v2.0*
