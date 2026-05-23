"""
Pydantic models – Commodity
"""

from pydantic import BaseModel, Field


class Commodity(BaseModel):
    commodity_id: str
    name: str
    category: str = Field(..., pattern="^(vegetable|fruit|staple|spice|dairy)$")


class CommodityCreate(BaseModel):
    name: str = Field(..., min_length=2)
    category: str = Field(..., pattern="^(vegetable|fruit|staple|spice|dairy)$")


class CommodityResponse(BaseModel):
    commodity_id: str
    name: str
    category: str
