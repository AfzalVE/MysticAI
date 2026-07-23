from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection

import os

app = FastAPI(title=settings.PROJECT_NAME)

origins = os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

@app.get("/")
def read_root():
    return {"message": "Welcome to MysticAI API"}

from app.api import fortune, tarot, chat, booking, auth, user, admin

app.include_router(fortune.router, prefix="/api/fortune", tags=["fortune"])
app.include_router(tarot.router, prefix="/api/tarot", tags=["tarot"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user.router, prefix="/api/user", tags=["User"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
