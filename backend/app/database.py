import sqlmodel
from app.settings import app_settings

DATABASE_URL = f"postgresql://{app_settings.db_user}:{app_settings.db_password}@localhost:{app_settings.db_port}/{app_settings.db_name}"

engine = sqlmodel.create_engine(DATABASE_URL)


def create_db_and_tables():
    sqlmodel.SQLModel.metadata.create_all(engine)


def get_session():
    with sqlmodel.Session(engine) as session:
        yield session
