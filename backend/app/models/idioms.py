from uuid import uuid4

from sqlalchemy import ARRAY, TEXT, TIMESTAMP, UUID, Column, String, func

from app.database import Base


class IdiomModel(Base):
    __tablename__ = "idioms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    text = Column(String)
    meaning = Column(String)
    explanation = Column(TEXT)
    examples = Column(ARRAY(String))

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), server_onupdate=func.now()
    )
