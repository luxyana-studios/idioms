from uuid import uuid4

from sqlalchemy import (
    TIMESTAMP,
    UUID,
    Column,
    String,
    func,
)

from app.database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    api_key = Column(String, default=uuid4, unique=True, index=True)
    installation_id = Column(String)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), server_onupdate=func.now()
    )
