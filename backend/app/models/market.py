"""
Pydantic models – Market
"""

from pydantic import BaseModel, Field
from typing import Optional


class Market(BaseModel):
    market_id: str
    name: str
    district: str
    province: str
    latitude: float
    longitude: float


class MarketCreate(BaseModel):
    name: str = Field(..., min_length=2)
    district: str
    province: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class MarketResponse(BaseModel):
    market_id: str
    name: str
    district: str
    province: str
    latitude: float
    longitude: float
