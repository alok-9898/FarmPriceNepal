"""
FarmPriceNepal – Auth Router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.models import UserCreate, UserLogin, UserResponse, TokenResponse
from app.database import get_db
from app.services.auth_service import get_password_hash, verify_password, create_access_token
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate):
    db = get_db()
    email = user_in.email.strip().lower()
    existing_user = await db.users.find_one({"email": email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user_in.dict()
    user_dict["email"] = email
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["user_id"] = str(uuid.uuid4())
    user_dict["created_at"] = datetime.utcnow()
    user_dict["market_preferences"] = []
    
    await db.users.insert_one(user_dict)
    return user_dict

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_db()
    email = credentials.email.strip().lower()
    
    user = await db.users.find_one({"email": email})
    
    if not user:
        # Avoid revealing if email exists or not for security, but we keep generic error
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }
