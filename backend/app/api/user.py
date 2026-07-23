from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.core.database import get_database
from app.models.user import UserResponse, UserUpdate, PasswordChange
from app.api.auth import get_current_user
from app.core.security import get_password_hash, verify_password
from bson import ObjectId

router = APIRouter()

def serialize_mongo(doc):
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    return doc

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user.get("name", ""),
        email=current_user.get("email", ""),
        dob=current_user.get("dob"),
        time_of_birth=current_user.get("time_of_birth"),
        birth_place=current_user.get("birth_place"),
        is_admin=current_user.get("is_admin", False)
    )

@router.put("/profile", response_model=UserResponse)
async def update_profile(profile_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    update_data = profile_data.dict(exclude_unset=True)
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    return UserResponse(
        id=str(updated_user["_id"]),
        name=updated_user.get("name", ""),
        email=updated_user.get("email", ""),
        dob=updated_user.get("dob"),
        time_of_birth=updated_user.get("time_of_birth"),
        birth_place=updated_user.get("birth_place"),
        is_admin=updated_user.get("is_admin", False)
    )

@router.put("/change-password")
async def change_password(passwords: PasswordChange, current_user: dict = Depends(get_current_user)):
    db = get_database()
    
    if not verify_password(passwords.old_password, current_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    hashed_new = get_password_hash(passwords.new_password)
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"hashed_password": hashed_new}}
    )
    
    return {"status": "success", "message": "Password updated successfully"}

@router.get("/readings")
async def get_readings(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.readings.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    readings = await cursor.to_list(length=100)
    return [serialize_mongo(r) for r in readings]

@router.get("/bookings")
async def get_bookings(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.bookings.find({"user_id": str(current_user["_id"])}).sort("created_at", -1)
    bookings = await cursor.to_list(length=100)
    return [serialize_mongo(b) for b in bookings]

from app.models.reading import ReadingCreate
from app.models.booking import BookingCreate
from datetime import datetime

@router.post("/save_reading")
async def save_reading(reading: ReadingCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    doc = {
        "user_id": str(current_user["_id"]),
        "type": reading.type,
        "data": reading.data,
        "created_at": datetime.utcnow()
    }
    result = await db.readings.insert_one(doc)
    return {"status": "success", "id": str(result.inserted_id)}

@router.post("/save_booking")
async def save_booking(booking: BookingCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    doc = {
        "user_id": str(current_user["_id"]),
        "consultation_type": booking.consultation_type,
        "date": booking.date,
        "time": booking.time,
        "details": booking.details,
        "status": "Confirmed",
        "created_at": datetime.utcnow()
    }
    result = await db.bookings.insert_one(doc)
    return {"status": "success", "id": str(result.inserted_id)}
