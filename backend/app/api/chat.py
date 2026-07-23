from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.schemas.all_schemas import ChatRequest, ChatResponse
from app.services.ai_service import chat_with_advisor
from app.api.auth import get_current_user
from app.core.database import get_database
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class ChatSessionResponse(BaseModel):
    id: str
    title: str
    updated_at: datetime

@router.get("/sessions", response_model=List[ChatSessionResponse])
async def get_sessions(current_user: dict = Depends(get_current_user)):
    db = get_database()
    cursor = db.chat_sessions.find({"user_id": current_user["_id"]}).sort("updated_at", -1)
    sessions = await cursor.to_list(length=100)
    return [{"id": str(s["_id"]), "title": s.get("title", "Mystic Guidance"), "updated_at": s.get("updated_at", datetime.utcnow())} for s in sessions]

@router.get("/session/{session_id}")
async def get_session(session_id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        session = await db.chat_sessions.find_one({"_id": ObjectId(session_id), "user_id": current_user["_id"]})
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"id": str(session["_id"]), "messages": session.get("messages", [])}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid session ID")

@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # 1. Get AI Reply
        reply = await chat_with_advisor(req.messages)
        
        # 2. Append new user message and AI reply to DB
        db = get_database()
        
        # We only save the last user message and the reply, 
        # since req.messages contains the whole history from the frontend.
        # Wait, if req.messages contains the whole history, we can just overwrite the session's messages array,
        # or just save the new ones. It's safer to just overwrite the messages array with the full history + reply.
        
        full_history = [m.dict() for m in req.messages]
        full_history.append({"role": "assistant", "content": reply})
        
        title = "Mystic Guidance"
        if len(req.messages) > 1:
            # Use the first user message as title if short enough
            title = req.messages[1].content[:30] + "..." if len(req.messages[1].content) > 30 else req.messages[1].content
            
        now = datetime.utcnow()
        session_id_str = req.session_id

        if not session_id_str:
            # Create new session
            res = await db.chat_sessions.insert_one({
                "user_id": current_user["_id"],
                "title": title,
                "messages": full_history,
                "created_at": now,
                "updated_at": now
            })
            session_id_str = str(res.inserted_id)
        else:
            # Update existing session
            await db.chat_sessions.update_one(
                {"_id": ObjectId(session_id_str), "user_id": current_user["_id"]},
                {"$set": {"messages": full_history, "updated_at": now, "title": title}}
            )

        return ChatResponse(reply=reply, session_id=session_id_str)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
