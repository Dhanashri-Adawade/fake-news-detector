from sqlalchemy import Column, Integer, String, Text, Float, TIMESTAMP
from sqlalchemy.sql import func

from database import Base


class NewsPrediction(Base):
    __tablename__ = "news_predictions"

    id = Column(Integer, primary_key=True, index=True)
    news_text = Column(Text, nullable=False)
    prediction = Column(String(10), nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())