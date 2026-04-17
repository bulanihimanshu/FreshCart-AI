import os
# Force CPU for tests
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

from fastapi.testclient import TestClient
from backend.main import app
import json

print("Starting API tests using TestClient...")

with TestClient(app) as client:
    # Test 1 & 2: Health
    try:
        response = client.get("/api/health")
        print(f"Health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health Test Failed: {e}")

    # Test 3: Auth Login
    try:
        response = client.post("/api/auth/login", json={"username": "raj_sharma", "password": "demo1234"})
        print(f"Login (Valid): {response.status_code} - {response.json()}")
        
        response = client.post("/api/auth/login", json={"username": "raj_sharma", "password": "wrong"})
        print(f"Login (Invalid, expected 401): {response.status_code}")
    except Exception as e:
        print(f"Login Test Failed: {e}")

    # Test 4: Product Search
    try:
        response = client.get("/api/products?query=milk")
        print(f"Product Search: {response.status_code} - returned {len(response.json())} items")
    except Exception as e:
        print(f"Product Search Failed: {e}")

    # Test 5: Recommendations
    try:
        print("Sending recommendation request:")
        response = client.post("/api/recommend", json={
            "user_id": 1,
            "cart_items": [43, 15],
            "hour": 12,
            "dow": 2,
            "days_gap": 7,
            "top_k": 5
        })
        print(f"Recommendations: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Recommendations Failed: {e}")
