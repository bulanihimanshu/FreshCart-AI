"""
FreshCart AI — FastAPI Application Entry Point

Initialises the FastAPI app, registers middleware, loads ML artefacts
via the `lifespan` context manager, and mounts all API routers.
"""

from __future__ import annotations

import json
import logging
from contextlib import asynccontextmanager
from pathlib import Path

import pandas as pd
import tensorflow as tf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api import health, recommend

# ---------------------------------------------------------------------------
# Paths — resolve relative to the project root (one level above this file)
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent  # project root

VOCAB_PATH = ROOT / "data" / "processed" / "vocab.json"
MODEL_PATH = ROOT / "saved_models" / "lstm_time_model.keras"
PRECOMPUTED_DIR = ROOT / "data" / "precomputed"
PRODUCTS_CSV = ROOT / "data" / "processed" / "products.csv"
AISLES_CSV = ROOT / "data" / "processed" / "aisles.csv"
DEPARTMENTS_CSV = ROOT / "data" / "processed" / "departments.csv"
USERS_PATH = Path(__file__).resolve().parent / "users.json"

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


# ---------------------------------------------------------------------------
# Lifespan — load all ML artefacts once at startup
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):  # noqa: D401
    """Load ML artefacts into ``app.state`` before serving requests."""

    # 1. Vocabulary  (product_id str → integer index)
    logger.info("Loading vocabulary from %s …", VOCAB_PATH)
    with VOCAB_PATH.open() as fh:
        app.state.vocab = json.load(fh)
    logger.info("Vocabulary loaded — %d tokens.", len(app.state.vocab))

    # 2. LSTM time-aware model
    logger.info("Loading LSTM model from %s …", MODEL_PATH)
    app.state.lstm_time_model = tf.keras.models.load_model(str(MODEL_PATH))
    logger.info("LSTM model loaded successfully.")

    # 3. Precomputed lookup tables
    def _load_json(name: str):
        path = PRECOMPUTED_DIR / name
        with path.open() as fh:
            return json.load(fh)

    app.state.global_top20 = _load_json("global_top20.json")
    app.state.hourly_top10 = _load_json("hourly_top10.json")
    app.state.dow_top10 = _load_json("dow_top10.json")
    app.state.aisle_top10 = _load_json("aisle_top10.json")
    logger.info("Precomputed lookup tables loaded.")

    # 4. Products lookup dict:  product_id (int) → {name, aisle, department}
    logger.info("Building products lookup from %s …", PRODUCTS_CSV)
    products_df = pd.read_csv(str(PRODUCTS_CSV))

    aisles_df = pd.read_csv(str(AISLES_CSV)) if AISLES_CSV.exists() else None
    depts_df = pd.read_csv(str(DEPARTMENTS_CSV)) if DEPARTMENTS_CSV.exists() else None

    if aisles_df is not None:
        products_df = products_df.merge(aisles_df, on="aisle_id", how="left")
    if depts_df is not None:
        products_df = products_df.merge(depts_df, on="department_id", how="left")

    app.state.products_df = {
        int(row["product_id"]): {
            "name": row["product_name"],
            "aisle": row.get("aisle", ""),
            "department": row.get("department", ""),
            "aisle_id": int(row["aisle_id"]),
            "department_id": int(row["department_id"]),
        }
        for _, row in products_df.iterrows()
    }
    logger.info("Products lookup built — %d products.", len(app.state.products_df))

    # 5. Users (demo users for auth + tier resolution)
    logger.info("Loading users from %s …", USERS_PATH)
    if USERS_PATH.exists():
        with USERS_PATH.open() as fh:
            app.state.users = json.load(fh)
        logger.info("Users loaded — %d demo users.", len(app.state.users))
    else:
        app.state.users = []
        logger.warning("users.json not found at %s — auth will fail.", USERS_PATH)

    yield  # application runs here

    # Teardown (nothing to clean up for these artefacts)
    logger.info("Shutting down FreshCart AI backend.")


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------
app = FastAPI(
    title="FreshCart AI",
    description="LSTM-powered grocery recommendation API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow React dev servers and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite default
        "http://localhost:3000",   # CRA default
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(health.router)
app.include_router(recommend.router)
