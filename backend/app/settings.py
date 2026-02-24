from pydantic_settings import BaseSettings, SettingsConfigDict


class AppSettings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    db_user: str
    db_password: str
    db_name: str
    db_port: str
    allowed_origins: list[str] = ["http://localhost:8081"]
    debug_mode: bool = False


app_settings = AppSettings()
