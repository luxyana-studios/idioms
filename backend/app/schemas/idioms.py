import uuid
import sqlmodel


class Idiom(sqlmodel.SQLModel, table=True):
    id: uuid.UUID | None = sqlmodel.Field(default=None, primary_key=True)
    text: str = sqlmodel.Field(index=True)
    meaning: int | None = sqlmodel.Field(default=None, index=True)
    secret_name: str
