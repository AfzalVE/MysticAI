from pydantic import BaseModel
from typing import Dict, Any

class ReadingCreate(BaseModel):
    type: str
    data: Dict[str, Any]
