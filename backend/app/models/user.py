from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    dob: Optional[str] = None
    time_of_birth: Optional[str] = None
    birth_place: Optional[str] = None
    is_admin: bool = False

class UserUpdate(BaseModel):
    name: str
    dob: Optional[str] = None
    time_of_birth: Optional[str] = None
    birth_place: Optional[str] = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str
