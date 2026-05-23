"""
Pydantic models – User
"""

from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=100)
    role: str = Field(default="farmer", pattern="^(farmer|trader|cooperative|analyst)$")


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    market_preferences: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserInDB(BaseModel):
    user_id: str
    name: str
    email: str
    hashed_password: str
    role: str = "farmer"
    market_preferences: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
