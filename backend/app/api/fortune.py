from fastapi import APIRouter, HTTPException
from app.schemas.all_schemas import FortuneRequest, FortuneResponse
from app.services.ai_service import generate_fortune
import random

router = APIRouter()

@router.post("/fortune", response_model=FortuneResponse)
async def get_fortune(req: FortuneRequest):
    try:
        raw_ai_response = await generate_fortune(req.name, req.dob, req.time_of_birth, req.birth_place)
        
        # We parse the AI response minimally here or let the frontend display it.
        # Since the schema requires specific fields, let's mock the parsing or generate structured data
        # For a robust implementation, the AI prompt should return JSON.
        
        lucky_number = random.randint(1, 99)
        lucky_color = random.choice(["Deep Purple", "Gold", "Midnight Blue", "Crimson", "Emerald"])
        
        return FortuneResponse(
            horoscope=raw_ai_response, # We put the whole reading here for now
            lucky_number=lucky_number,
            lucky_color=lucky_color,
            personality_traits="Mystical, Intuitive, Strong-willed",
            career_guidance="Follow your inner voice",
            love_compatibility="Water signs",
            daily_prediction="A surprise awaits you."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
