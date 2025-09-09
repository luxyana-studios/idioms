from fastapi.testclient import TestClient

from app.main import app


def test_middleware_requires_api_key():
    client = TestClient(app)

    response = client.get("/idioms/categories")
    assert response.status_code == 401
    assert "API key is required" in response.json()["detail"]


def test_middleware_validates_api_key():
    client = TestClient(app)
    headers = {"apiKey": "invalid-key"}
    response = client.get("/idioms/categories", headers=headers)
    assert response.status_code == 401
    assert "Invalid API key" in response.json()["detail"]


def test_middleware_allows_exempt_paths():
    client = TestClient(app)

    response = client.get("/")
    assert response.status_code == 200

    response = client.get("/docs")
    assert response.status_code == 200


def test_user_registration_does_not_require_api_key():
    client = TestClient(app)

    response = client.post(
        "/users/register", json={"installation_id": "test-installation-123"}
    )
    assert response.status_code == 200
    assert "api_key" in response.json()
