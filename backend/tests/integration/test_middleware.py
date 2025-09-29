def test_middleware_requires_api_key(test_server):
    response = test_server.get("/idioms/categories")
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized"


def test_middleware_validates_api_key(test_server):
    headers = {"x-api-key": "invalid-key"}
    response = test_server.get("/idioms/categories", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Unauthorized"


def test_middleware_allows_exempt_paths(test_server):
    response = test_server.get("/")
    assert response.status_code == 200

    response = test_server.get("/docs")
    assert response.status_code == 200


def test_user_registration_does_not_require_api_key(test_server):
    response = test_server.post(
        "/users/register", json={"installation_id": "test-installation-123"}
    )
    assert response.status_code == 200
    assert "api_key" in response.json()


def test_user_registration_returns_valid_api_key(test_server):
    response = test_server.post(
        "/users/register", json={"installation_id": "test-auth-flow"}
    )
    assert response.status_code == 200
    user_data = response.json()
    api_key = user_data["api_key"]

    headers = {"x-api-key": api_key}
    response = test_server.get("/idioms/categories", headers=headers)
    assert response.status_code == 200


def test_duplicate_installation_id_creates_different_users(test_server):
    installation_id = "duplicate-test"

    response1 = test_server.post(
        "/users/register", json={"installation_id": installation_id}
    )
    response2 = test_server.post(
        "/users/register", json={"installation_id": installation_id}
    )

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response1.json()["api_key"] != response2.json()["api_key"]
