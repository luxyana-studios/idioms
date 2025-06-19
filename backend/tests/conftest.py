from pathlib import Path

import pytest
from dotenv import load_dotenv

TEST_DIR = Path(__file__).parent


@pytest.fixture(scope="session", autouse=True)
def env_settings():
    load_dotenv(TEST_DIR / "env.testing")


@pytest.fixture(scope="session")
def docker_compose_project_name() -> str:
    return "idioms-test-stack"


# Stop the stack before starting a new one
@pytest.fixture(scope="session")
def docker_setup():
    return ["down -v", "up --build -d"]


@pytest.fixture(scope="session")
def docker_compose_file():
    return TEST_DIR / "docker-compose-test.yaml"


@pytest.fixture(scope="session")
def database(_docker_services):
    yield


@pytest.fixture(scope="module")
def test_server(_database):
    from fastapi.testclient import TestClient

    from app.main import app

    client = TestClient(app)
    yield client
