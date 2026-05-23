"""
FarmPriceNepal – Markets Router
"""

from fastapi import APIRouter, Depends
from typing import List
from app.models import MarketResponse
from app.database import get_db
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/", response_model=List[MarketResponse])
async def get_markets(db=Depends(get_db)):
    markets = await db.markets.find().to_list(100)
    return markets

@router.get("/{market_id}", response_model=MarketResponse)
async def get_market(market_id: str, db=Depends(get_db)):
    market = await db.markets.find_one({"market_id": market_id})
    return market
