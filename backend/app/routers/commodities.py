"""
FarmPriceNepal – Commodities Router
"""

from fastapi import APIRouter, Depends
from typing import List
from app.models import CommodityResponse
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[CommodityResponse])
async def get_commodities(db=Depends(get_db)):
    commodities = await db.commodities.find().to_list(100)
    return commodities

@router.get("/categories")
async def get_categories(db=Depends(get_db)):
    categories = await db.commodities.distinct("category")
    return categories
