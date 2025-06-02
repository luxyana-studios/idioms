from uuid import uuid4

from sqlalchemy import ARRAY, FLOAT, TEXT, TIMESTAMP, UUID, Column, String, func

from app.database import Base


class IdiomModel(Base):
    __tablename__ = "idioms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, index=True)
    text = Column(String)
    meaning = Column(String)
    explanation = Column(TEXT)
    examples = Column(ARRAY(String))
    frequency_of_use = Column(FLOAT)
    category_theme = Column(ARRAY(String))
    sentiment = Column(ARRAY(String))
    context_diversity = Column(ARRAY(String))
    literal_transparency = Column(FLOAT)
    translation_difficulty = Column(FLOAT)
    depiction = Column(ARRAY(String))
    alternative_depiction = Column(ARRAY(String))
    meaning_depiction = Column(ARRAY(String))

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP, server_default=func.now(), server_onupdate=func.now()
    )
