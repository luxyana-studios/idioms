from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class IdiomSchema(BaseModel):
    id: UUID
    text: str
    meaning: str
    explanation: str
    examples: list[str]
    frequency_of_use: float
    category_theme: list[str]
    sentiment: list[str]
    context_diversity: list[str]
    literal_transparency: float
    translation_difficulty: float
    depiction: list[str]
    alternative_depiction: list[str]
    meaning_depiction: list[str]
    favorite: bool = False
    upvotes: int = 0
    downvotes: int = 0

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# TODO: Add field validations and descriptions, see data mining scripts
class IdiomCreate(BaseModel):
    text: str
    meaning: str
    explanation: str
    examples: list[str]
    frequency_of_use: float
    category_theme: list[str]
    sentiment: list[str]
    context_diversity: list[str]
    literal_transparency: float
    translation_difficulty: float
    depiction: list[str]
    alternative_depiction: list[str]
    meaning_depiction: list[str]
    favorite: bool = False
    upvotes: int = 0
    downvotes: int = 0


class IdiomUpdate(BaseModel):
    favorite: bool | None = None
