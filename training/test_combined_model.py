import joblib

model = joblib.load("combined_fake_news_model.pkl")
vectorizer = joblib.load("combined_tfidf_vectorizer.pkl")

test_news = [
    "OpenAI launches a new AI model for developers",
    "India announces new AI policy for startups",
    "NASA discovers signs of water on Mars",
    "Aliens elected as chief ministers in India",
    "Government launches nationwide digital education initiative"
]

for news in test_news:
    transformed = vectorizer.transform([news])

    prediction = model.predict(transformed)[0]

    label = "Real" if prediction == 1 else "Fake"

    print("\nNews:", news)
    print("Prediction:", label)