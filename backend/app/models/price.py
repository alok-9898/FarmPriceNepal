"""
Pydantic models – Price
"""

from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional


class PriceRecord(BaseModel):
    market_id: str
    commodity_id: str
    date: date
    price_npr: float = Field(..., gt=0, description="Price in Nepali Rupees per unit")
    unit: str = Field(default="kg", pattern="^(kg|unit|dozen|liter)$")


class PriceCreate(BaseModel):
    market_id: str
    commodity_id: str
    date: date
    price_npr: float = Field(..., gt=0)
    unit: str = "kg"


class PriceResponse(BaseModel):
    market_id: str
    commodity_id: str
    date: date
    price_npr: float
    unit: str


class PriceBulkUpload(BaseModel):
    """Schema for CSV bulk upload result."""
    records_inserted: int
    records_skipped: int
    errors: list = []
