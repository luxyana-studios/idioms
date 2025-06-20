from app.schemas.idioms import IdiomCreate


def test_get_idioms_returns_8_elements(test_server):
    response = test_server.get("/idioms/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 8


def test_get_idioms_search_query_full_name(test_server, idioms_test_data):
    response = test_server.get("/idioms/?search=work")
    assert response.status_code == 200

    actual_idioms = response.json()
    expected_idioms = [idioms_test_data.get("All in a day's work")]
    assert_idioms(actual_idioms, expected_idioms)


def assert_idioms(actual: list[dict], expected: list[IdiomCreate]) -> None:
    assert len(actual) == len(expected)
    actual = [IdiomCreate(**idiom) for idiom in actual]

    assert actual == expected
