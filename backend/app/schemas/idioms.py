from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


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


class IdiomCreate(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    meaning: str = Field(..., min_length=1, max_length=1000)
    explanation: str = Field(..., min_length=1, max_length=2000)
    examples: list[str] = Field(..., min_length=1, max_length=10)
    frequency_of_use: float = Field(..., ge=0.0, le=1.0)
    category_theme: list[str] = Field(..., min_length=1, max_length=10)
    sentiment: list[str] = Field(..., min_length=1, max_length=10)
    context_diversity: list[str] = Field(..., min_length=1, max_length=10)
    literal_transparency: float = Field(..., ge=0.0, le=1.0)
    translation_difficulty: float = Field(..., ge=0.0, le=1.0)
    depiction: list[str] = Field(..., max_length=10)
    alternative_depiction: list[str] = Field(..., max_length=10)
    meaning_depiction: list[str] = Field(..., max_length=10)
    favorite: bool = False
    upvotes: int = Field(default=0, ge=0)
    downvotes: int = Field(default=0, ge=0)


class IdiomUpdate(BaseModel):
    favorite: bool | None = None
