import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "PhysioVision" in data["service"]
    assert "supported_video_formats" in data

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["service"] == "physiovision-api"

def test_api_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_exercises_endpoint():
    response = client.get("/api/exercises")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 4
    exercise_ids = [ex["id"] for ex in data["exercises"]]
    assert "squat" in exercise_ids
    assert "bicep_curl" in exercise_ids
    assert "shoulder_flexion" in exercise_ids
    assert "knee_extension" in exercise_ids
