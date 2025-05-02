from uuid import uuid4

from sqlalchemy import TEXT, TIMESTAMP, UUID, Column, func

from app.database import Base


class IdiomModel(Base):
    __tablename__ = "idiom"

    id = Column(UUID, primary_key=True, default=uuid4, index=True)
    text = Column(TEXT)
    meaning = Column(TEXT)
    explanation = Column(TEXT)
    examples = Column(TEXT)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), server_onupdate=func.now()
    )
