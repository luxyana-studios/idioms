import pydantic_settings


class AppSettings(pydantic_settings.BaseSettings):
    model_config = pydantic_settings.SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    db_user: str
    db_password: str
    db_name: str
    db_port: str


app_settings = AppSettings()
