from pydantic import BaseModel
from typing import Dict, Any

class BookingCreate(BaseModel):
    consultation_type: str
    date: str
    time: str
    details: Dict[str, Any]
    status: str = "pending"
