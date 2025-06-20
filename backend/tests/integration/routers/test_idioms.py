def test_get_idioms_returns_8_elements(test_server):
    response = test_server.get("/idioms/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 8
