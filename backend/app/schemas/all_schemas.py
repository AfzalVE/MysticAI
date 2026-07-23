from pydantic import BaseModel
from typing import Optional, List

class FortuneRequest(BaseModel):
    name: str
    dob: str
    time_of_birth: Optional[str] = None
    birth_place: Optional[str] = None

class FortuneResponse(BaseModel):
    horoscope: str
    lucky_number: int
    lucky_color: str
    personality_traits: str
    career_guidance: str
    love_compatibility: str
    daily_prediction: str

class TarotRequest(BaseModel):
    spread_type: str # "1_card", "3_card", "celtic_cross"

class TarotCard(BaseModel):
    name: str
    meaning: str
    position: Optional[str] = None # e.g. "Past", "Present", "Future"

class TarotResponse(BaseModel):
    cards: List[TarotCard]
    interpretation: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    session_id: Optional[str] = None

class BookingRequest(BaseModel):
    date: str
    time: str
    name: str
    email: str
    phone: Optional[str] = None

class BookingResponse(BaseModel):
    status: str
    booking_id: str
    message: str
