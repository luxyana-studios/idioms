def test_server_is_up(test_server):
    response = test_server.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
