import joblib
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Base, NewsPrediction
import schemas

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# ============================================================
# MODEL LOADING SECTION
# ============================================================
# Switch ACTIVE_MODEL between "distilbert" and "old" to change
# which model the /predict route uses. Everything else stays same.
ACTIVE_MODEL = "distilbert"   # change to "old" to roll back

# ---- OLD model (TF-IDF + Logistic Regression) — kept as backup ----
old_model = joblib.load("fake_news_model.pkl")
old_vectorizer = joblib.load("tfidf_vectorizer.pkl")

# ---- NEW model (DistilBERT) ----
MODEL_PATH = "../model/fake_news_distilbert"
tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
distilbert_model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
distilbert_model.eval()  # tells PyTorch: prediction mode only, not training


# Database connection function
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request schema
class NewsRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "Fake News Detection API is running"}


@app.post("/predict")
def predict(news: NewsRequest, db: Session = Depends(get_db)):

    if ACTIVE_MODEL == "distilbert":
        # ---- NEW MODEL PREDICTION (DistilBERT) ----
        inputs = tokenizer(
            news.text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256
        )

        with torch.no_grad():
            outputs = distilbert_model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=1)[0]

        confidence_tensor, predicted_class = torch.max(probs, dim=0)

        result = "Real" if predicted_class.item() == 1 else "Fake"
        confidence = confidence_tensor.item() * 100

    else:
        # ---- OLD MODEL PREDICTION (TF-IDF + Logistic Regression) ----
        text_tfidf = old_vectorizer.transform([news.text])
        prediction = old_model.predict(text_tfidf)[0]
        confidence = max(old_model.predict_proba(text_tfidf)[0]) * 100
        result = "Real" if prediction == 1 else "Fake"

    # Save prediction to database (same for both models)
    new_prediction = NewsPrediction(
        news_text=news.text,
        prediction=result,
        confidence=round(confidence, 2)
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return {
        "prediction": result,
        "confidence": round(confidence, 2)
    }


@app.get("/history", response_model=list[schemas.PredictionHistory])
def get_history(db: Session = Depends(get_db)):
    history = db.query(NewsPrediction).all()
    return history