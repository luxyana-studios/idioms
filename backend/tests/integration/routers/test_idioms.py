from app.schemas.idioms import IdiomCreate


def test_get_idioms_returns_8_elements(test_server):
    response = test_server.get("/idioms/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 8


def test_get_random_idioms_remains_stable_under_pagination(test_server):
    response = test_server.get("/idioms/random?seed=123&page=1&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    first_page_ids = [idiom["id"] for idiom in data]

    response = test_server.get("/idioms/random?seed=123&page=1&limit=4")
    assert response.status_code == 200
    data = response.json()
    second_page_ids = [idiom["id"] for idiom in data]
    assert second_page_ids[:2] == first_page_ids


def test_get_idioms_search_query_full_name(test_server, idioms_test_data):
    response = test_server.get("/idioms/?text=work")
    assert response.status_code == 200

    actual_idioms = response.json()
    expected_idioms = [idioms_test_data.get("All in a day's work")]
    assert_idioms(actual_idioms, expected_idioms)


def test_get_idioms_sort_frequency(test_server, idioms_test_data):
    response = test_server.get("/idioms/?sort=frequency")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = sorted(
        idioms_test_data.values(), key=lambda x: x.frequency_of_use, reverse=True
    )
    assert_idioms(actual_idioms, expected_idioms)


def test_get_idioms_sort_imagery(test_server, idioms_test_data):
    response = test_server.get("/idioms/?sort=imagery")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = sorted(
        idioms_test_data.values(), key=lambda x: x.literal_transparency, reverse=True
    )
    assert_idioms(actual_idioms, expected_idioms)


def assert_idioms(actual: list[dict], expected: list[IdiomCreate]) -> None:
    assert len(actual) == len(expected)
    actual = [IdiomCreate(**idiom) for idiom in actual]

    assert actual == expected
