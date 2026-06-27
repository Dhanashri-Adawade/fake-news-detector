from pydantic import BaseModel
from datetime import datetime


class PredictionHistory(BaseModel):
    id: int
    news_text: str
    prediction: str
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True