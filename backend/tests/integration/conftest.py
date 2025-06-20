import json
from pathlib import Path

import psycopg2
import pytest
from dotenv import load_dotenv
from psycopg2 import OperationalError

from app.schemas.idioms import IdiomCreate

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


def is_postgres_responsive():
    from app.database import DATABASE_URL

    try:
        conn = psycopg2.connect(DATABASE_URL)
        conn.close()
        return True
    except OperationalError:
        return False


def write_sample_idioms_to_db():
    from app.database import SessionLocal, create_db_and_tables
    from app.models.idioms import IdiomModel

    create_db_and_tables()

    sample_path = Path(TEST_DIR).parent / "resources" / "sample_idioms.json"
    with open(sample_path, encoding="utf-8") as f:
        idioms_data = json.load(f)

    idioms = [IdiomCreate(**data) for data in idioms_data.values()]

    with SessionLocal() as db:
        db.add_all([IdiomModel(**idiom.model_dump()) for idiom in idioms])
        db.commit()


@pytest.fixture(scope="session")
def _database(docker_services):  # noqa: ARG001
    docker_services.wait_until_responsive(
        timeout=30.0,
        pause=1,
        check=lambda: is_postgres_responsive(),
    )

    write_sample_idioms_to_db()

    yield


@pytest.fixture(scope="session")
def test_server(_database):
    from fastapi.testclient import TestClient

    from app.main import app

    client = TestClient(app)
    yield client
