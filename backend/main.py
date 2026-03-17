from fastapi import FastAPI
from pydantic import BaseModel
from services.weather_service import get_weather
from services.ai_service import generate_advice
from services.air_quality_service import get_air_quality
from database import engine, Base, SessionLocal
from models.chat_model import ChatHistory
from fastapi.middleware.cors import CORSMiddleware
import json

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    city: str


@app.post("/chat")
def chat(request: ChatRequest):

    weather = get_weather(request.city)
    air = get_air_quality(weather["lat"], weather["lon"])

    ai_text = generate_advice(request.city, weather, air)

    try:
        ai_data = json.loads(ai_text)
    except:
        ai_data = {
            "risk_level": "Unknown",
            "risk_reason": [],
            "comfort_level": "Unknown",
            "activity_recommendation": [],
            "sensitive_group": [],
            "advice": ai_text
        }

    db = SessionLocal()

    history = ChatHistory(
        city=request.city,
        advice=ai_data["advice"]
    )

    db.add(history)
    db.commit()
    db.close()

    return {
    "weather": weather,
    "air_quality": air,

    "risk_level": ai_data["risk_level"],
    "risk_reason": ai_data["risk_reason"],

    "comfort_level": ai_data["comfort_level"],
    "comfort_reason": ai_data["comfort_reason"],

    "outdoor_activity": ai_data["outdoor_activity"],
    "activity_reason": ai_data["activity_reason"],

    "sensitive_warning": ai_data["sensitive_warning"],
    "warning_reason": ai_data["warning_reason"],

    "advice": ai_data["advice"],

    "confidence": ai_data["confidence"],
    "smart_alert": ai_data["smart_alert"],
    "health_prediction": ai_data["health_prediction"]
}


@app.get("/history")
def get_history():

    db = SessionLocal()

    chats = db.query(ChatHistory).order_by(ChatHistory.id.desc()).all()

    result = []
    for c in chats:
        result.append({
            "city": c.city,
            "advice": c.advice,
            "time": c.created_at
        })

    db.close()

    return result