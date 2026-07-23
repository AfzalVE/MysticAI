from fastapi import APIRouter, Depends, HTTPException, status, Body
from app.core.database import get_database
from app.api.auth import get_current_user
from typing import List, Dict, Any

router = APIRouter()

def serialize_mongo(doc):
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

async def require_admin(current_user: dict = Depends(get_current_user)):
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

async def get_user_map(db):
    users = await db.users.find({}).to_list(length=None)
    return {str(u["_id"]): u.get("name", "Unknown User") for u in users}

@router.get("/stats")
async def get_stats(admin_user: dict = Depends(require_admin)):
    db = get_database()
    users_count = await db.users.count_documents({})
    readings_count = await db.readings.count_documents({})
    chats_count = await db.chat_sessions.count_documents({})
    bookings_count = await db.bookings.count_documents({})
    
    return {
        "total_users": users_count,
        "total_readings": readings_count,
        "total_chats": chats_count,
        "total_bookings": bookings_count
    }

@router.get("/users")
async def get_users(admin_user: dict = Depends(require_admin)):
    db = get_database()
    cursor = db.users.find({}).sort("_id", -1)
    users = await cursor.to_list(length=1000)
    
    for u in users:
        u.pop("hashed_password", None)
        serialize_mongo(u)
    return users

@router.get("/readings")
async def get_all_readings(admin_user: dict = Depends(require_admin)):
    db = get_database()
    user_map = await get_user_map(db)
    
    cursor = db.readings.find({}).sort("created_at", -1)
    readings = await cursor.to_list(length=1000)
    
    for r in readings:
        serialize_mongo(r)
        user_id = str(r.get("user_id"))
        r["user_name"] = user_map.get(user_id, "Unknown User")
    return readings

@router.get("/chat-logs")
async def get_all_chats(admin_user: dict = Depends(require_admin)):
    db = get_database()
    user_map = await get_user_map(db)
    
    cursor = db.chat_sessions.find({}).sort("updated_at", -1)
    chats = await cursor.to_list(length=1000)
    
    for c in chats:
        serialize_mongo(c)
        user_id = str(c.get("user_id"))
        c["user_name"] = user_map.get(user_id, "Unknown User")
    return chats

@router.get("/bookings")
async def get_all_bookings(admin_user: dict = Depends(require_admin)):
    db = get_database()
    user_map = await get_user_map(db)
    
    cursor = db.bookings.find({}).sort("created_at", -1)
    bookings = await cursor.to_list(length=1000)
    
    for b in bookings:
        serialize_mongo(b)
        user_id = str(b.get("user_id"))
        b["user_name"] = user_map.get(user_id, "Unknown User")
    return bookings

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status_update: str = Body(..., embed=True), admin_user: dict = Depends(require_admin)):
    db = get_database()
    
    # booking_id could be a UUID from mock checkout, or an ObjectId. We'll try finding it directly first.
    result = await db.bookings.update_one(
        {"_id": booking_id},
        {"$set": {"status": status_update}}
    )
    
    # If not found by exact string, try ObjectId if it's a valid 24-char hex
    if result.modified_count == 0 and len(booking_id) == 24:
        from bson import ObjectId
        result = await db.bookings.update_one(
            {"_id": ObjectId(booking_id)},
            {"$set": {"status": status_update}}
        )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found or status is already the same")
        
    return {"status": "success", "message": "Booking status updated to " + status_update}
