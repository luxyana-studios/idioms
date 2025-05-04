from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class IdiomSchema(BaseModel):
    id: UUID
    text: str
    meaning: str
    explanation: str
    examples: list[str]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IdiomCreate(BaseModel):
    text: str
    meaning: str
    explanation: str
    examples: list[str]
