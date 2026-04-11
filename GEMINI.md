<!-- GSD:project-start source:PROJECT.md -->
## Project

**FreshCart AI**

FreshCart AI is a real grocery shopping app (React + FastAPI) powered by an LSTM-based recommendation engine trained on the Instacart Market Basket Dataset. It is a university AI/ML project and portfolio piece that demonstrates three innovations beyond the Apriori baseline: sequential LSTM recommendations, time-aware context embeddings, and a three-tier cold start system — all surfaced naturally within a polished grocery UX. Five pre-seeded demo users with different order histories make the cold start tiers instantly demonstrable.

**Core Value:** The LSTM model runs silently in the background and surfaces personalized, time-aware "next item" recommendations at natural moments in the shopping flow — just like a real grocery app — so the AI/ML innovation can be demoed without any technical explanation.

### Constraints

- **Tech Stack (ML):** TensorFlow / Keras for LSTM — must be written from scratch (no recommender libraries), trained in Jupyter notebooks
- **Tech Stack (Backend):** Python FastAPI + Uvicorn — already specified in PRD
- **Tech Stack (Frontend):** React.js + Tailwind CSS — already specified in PRD. Axios for HTTP calls
- **Dataset:** Instacart Kaggle data (raw CSVs must be gitignored — too large for repo)
- **Timeline:** 15-day implementation plan — phases prioritize ML pipeline first, then backend, then frontend
- **Auth Simplicity:** No JWT, no OAuth — simple session-based with hardcoded `users.json`
- **Model Training:** GPU required (Google Colab T4 or local) — CPU training is too slow for 20 epochs on this dataset
- **University Context:** Code + Report + GitHub + Live Demo + Professor scripts are all required deliverables
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
