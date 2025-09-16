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
