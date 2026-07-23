from fastapi import APIRouter, HTTPException
from app.schemas.all_schemas import TarotRequest, TarotResponse, TarotCard
from app.services.ai_service import interpret_tarot
import random

router = APIRouter()

TAROT_DECK = [
    {"name": "The Fool", "meaning": "New beginnings, spontaneity"},
    {"name": "The Magician", "meaning": "Manifestation, resourcefulness"},
    {"name": "The High Priestess", "meaning": "Intuition, unconscious"},
    {"name": "The Empress", "meaning": "Femininity, beauty, nature"},
    {"name": "The Emperor", "meaning": "Authority, establishment"},
    {"name": "The Hierophant", "meaning": "Spiritual wisdom, religious beliefs"},
    {"name": "The Lovers", "meaning": "Love, harmony, relationships"},
    {"name": "The Chariot", "meaning": "Control, willpower, success"},
    {"name": "Strength", "meaning": "Courage, persuasion, influence"},
    {"name": "The Hermit", "meaning": "Soul-searching, introspection"},
    {"name": "Wheel of Fortune", "meaning": "Good luck, karma, life cycles"},
    {"name": "Justice", "meaning": "Justice, fairness, truth"},
    {"name": "The Hanged Man", "meaning": "Pause, surrender, letting go"},
    {"name": "Death", "meaning": "Endings, change, transformation"},
    {"name": "Temperance", "meaning": "Balance, moderation, patience"},
    {"name": "The Devil", "meaning": "Shadow self, attachment, addiction"},
    {"name": "The Tower", "meaning": "Sudden change, upheaval, chaos"},
    {"name": "The Star", "meaning": "Hope, faith, rejuvenation"},
    {"name": "The Moon", "meaning": "Illusion, fear, anxiety"},
    {"name": "The Sun", "meaning": "Positivity, fun, warmth, success"},
    {"name": "Judgement", "meaning": "Judgement, rebirth, inner calling"},
    {"name": "The World", "meaning": "Completion, integration, accomplishment"}
]

@router.post("/draw", response_model=TarotResponse)
async def draw_cards(req: TarotRequest):
    try:
        num_cards = 1
        if req.spread_type == "3_card":
            num_cards = 3
        elif req.spread_type == "celtic_cross":
            num_cards = 10
            
        selected_cards_data = random.sample(TAROT_DECK, num_cards)
        cards = []
        positions = ["Past", "Present", "Future"]
        for i, c in enumerate(selected_cards_data):
            pos = positions[i] if req.spread_type == "3_card" and i < 3 else None
            cards.append(TarotCard(name=c["name"], meaning=c["meaning"], position=pos))
            
        interpretation = await interpret_tarot(cards, req.spread_type)
        return TarotResponse(cards=cards, interpretation=interpretation)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
