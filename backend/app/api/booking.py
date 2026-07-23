from fastapi import APIRouter, HTTPException
from app.schemas.all_schemas import BookingRequest, BookingResponse
from app.models.booking import BookingCreate
from app.core.database import get_database
import uuid

router = APIRouter()

@router.post("/create-checkout", response_model=BookingResponse)
async def create_checkout(req: BookingCreate):
    try:
        db = get_database()
        booking_collection = db["bookings"]
        
        session_id = str(uuid.uuid4())
        booking_doc = req.dict()
        booking_doc["_id"] = session_id
        booking_doc["status"] = "pending"
        
        await booking_collection.insert_one(booking_doc)
        
        return BookingResponse(
            status="success",
            booking_id=session_id,
            message="Checkout session created"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/checkout/{session_id}")
async def get_checkout(session_id: str):
    try:
        db = get_database()
        booking = await db["bookings"].find_one({"_id": session_id})
        if not booking:
            raise HTTPException(status_code=404, detail="Session not found")
        return booking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/confirm/{session_id}")
async def confirm_payment(session_id: str):
    try:
        db = get_database()
        result = await db["bookings"].update_one(
            {"_id": session_id},
            {"$set": {"status": "paid"}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Session not found or already paid")
        return {"status": "success", "message": "Payment confirmed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/slots")
async def get_slots(date: str):
    # Dummy logic to return available slots
    return {"available_slots": ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"]}
