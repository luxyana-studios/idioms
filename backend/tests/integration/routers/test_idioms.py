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
    # Test ascending order
    response = test_server.get("/idioms/?sort=frequency")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = sorted(
        idioms_test_data.values(), key=lambda x: x.frequency_of_use
    )
    assert_idioms(actual_idioms, expected_idioms)

    # Test descending order
    response = test_server.get("/idioms/?sort=-frequency")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = list(reversed(expected_idioms))
    assert_idioms(actual_idioms, expected_idioms)


def test_get_idioms_sort_imagery(test_server, idioms_test_data):
    # Test ascending order
    response = test_server.get("/idioms/?sort=imagery")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = sorted(
        idioms_test_data.values(), key=lambda x: x.literal_transparency
    )
    assert_idioms(actual_idioms, expected_idioms)

    # Test descending order
    response = test_server.get("/idioms/?sort=-imagery")
    assert response.status_code == 200
    actual_idioms = response.json()
    expected_idioms = list(reversed(expected_idioms))
    assert_idioms(actual_idioms, expected_idioms)


def test_get_categories_returns_all_unique_categories(test_server, idioms_test_data):
    response = test_server.get("/idioms/categories")
    assert response.status_code == 200

    categories = response.json()
    assert isinstance(categories, list)
    assert len(categories) > 0

    # Collect all expected categories from test data
    expected_categories_sorted = sorted(
        {
            category
            for idiom in idioms_test_data.values()
            for category in idiom.context_diversity
        }
    )

    # Verify categories are returned in alphabetical order
    assert categories == expected_categories_sorted


def test_get_idioms_filter_by_category(test_server, idioms_test_data):
    # Test filtering by "business" category
    response = test_server.get("/idioms/?category=business")
    assert response.status_code == 200

    actual_idioms = response.json()

    # Collect expected idioms that have "business" in their context_diversity
    expected_idioms = [
        idiom
        for idiom in idioms_test_data.values()
        if "business" in idiom.context_diversity
    ]

    assert_idioms(actual_idioms, expected_idioms)
    assert len(actual_idioms) > 0, (
        "Should find at least one idiom with 'business' category"
    )


def test_get_idioms_filter_by_categories(test_server, idioms_test_data):
    # Test filtering by "business" or "daily life" category
    response = test_server.get("/idioms/?category=business,daily life")
    assert response.status_code == 200

    actual_idioms = response.json()

    # Collect expected idioms that have "business" OR "daily life" in context_diversity
    expected_idioms = [
        idiom
        for idiom in idioms_test_data.values()
        if (
            "business" in idiom.context_diversity
            or "daily life" in idiom.context_diversity
        )
    ]

    assert_idioms(actual_idioms, expected_idioms)
    assert len(actual_idioms) > 0, (
        "Should find at least one idiom with 'business' or 'daily life' category"
    )


def test_get_idioms_filter_by_category_and_text(test_server, idioms_test_data):
    # Test combining category filter with text search
    response = test_server.get("/idioms/?category=business&text=work")
    assert response.status_code == 200

    actual_idioms = response.json()

    # Expected idioms should have both "business" category AND contain "work" in text
    expected_idioms = [
        idiom
        for idiom in idioms_test_data.values()
        if "business" in idiom.context_diversity and "work" in idiom.text.lower()
    ]

    assert_idioms(actual_idioms, expected_idioms)


def test_get_idioms_filter_by_nonexistent_category(test_server):
    # Test filtering by a category that doesn't exist
    response = test_server.get("/idioms/?category=nonexistent_category")
    assert response.status_code == 200

    actual_idioms = response.json()
    assert len(actual_idioms) == 0, "Should return empty list for nonexistent category"


def test_get_idioms_filter_by_category_with_text_no_matches(test_server):
    # Test combining category with text that has no matches
    response = test_server.get("/idioms/?category=business&text=xyz123")
    assert response.status_code == 200

    actual_idioms = response.json()
    assert len(actual_idioms) == 0, (
        "Should return empty list when no idioms match both criteria"
    )


def assert_idioms(actual: list[dict], expected: list[IdiomCreate]) -> None:
    assert len(actual) == len(expected)
    actual = [IdiomCreate(**idiom) for idiom in actual]

    assert actual == expected
