from fastapi import APIRouter, HTTPException
from app.schemas.all_schemas import BookingRequest, BookingResponse
from app.core.database import get_database
import uuid

router = APIRouter()

@router.post("/schedule", response_model=BookingResponse)
async def schedule_booking(req: BookingRequest):
    try:
        db = get_database()
        booking_collection = db["bookings"]
        
        booking_id = str(uuid.uuid4())
        booking_doc = req.dict()
        booking_doc["_id"] = booking_id
        
        await booking_collection.insert_one(booking_doc)
        
        return BookingResponse(
            status="success",
            booking_id=booking_id,
            message="Your session has been successfully booked!"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/slots")
async def get_slots(date: str):
    # Dummy logic to return available slots
    return {"available_slots": ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"]}
