from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class IdiomSchema(BaseModel):
    id: UUID
    text: str
    meaning: str
    explanation: str
    examples: str

    created_at: datetime
    updated_at: datetime
