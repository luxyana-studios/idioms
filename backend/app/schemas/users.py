from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class UserSchema(BaseModel):
    id: UUID
    installation_id: str
    api_key: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    installation_id: str
