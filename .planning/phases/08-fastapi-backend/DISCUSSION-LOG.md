# Phase 8 Discussion Log

Question 1: Product Search Scope
Options:
- 1A: Search only the 5,000 products in the model's vocabulary
- 1B: Search all ~50K full Instacart products
Selected: 1A

Question 2: Project Structure
Options:
- 2A: Distributed separate files using APIRouter in `backend/api/`
- 2B: Flat, with all endpoints inside a single `backend/main.py`
Selected: 2A

Question 3: State Management
Options:
- 3A: Load into an app-level dictionary variable using FastAPI's `lifespan` context manager
- 3B: Use FastAPI Dependency Injection
Selected: 3A

Question 4: Professor Scripts Output
Options:
- 4A: Beautifully formatted terminal tables using `rich`
- 4B: Plain terminal strings via `pandas`
Selected: 4B
