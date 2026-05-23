"""
Pydantic models – Weather
"""

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional


class WeatherRecord(BaseModel):
    location_id: str
    date: date
    temp_c: float
    humidity_pct: float = Field(..., ge=0, le=100)
    rainfall_mm: float = Field(..., ge=0)


class WeatherCreate(BaseModel):
    location_id: str
    date: date
    temp_c: float
    humidity_pct: float
    rainfall_mm: float


class WeatherResponse(BaseModel):
    location_id: str
    date: date
    temp_c: float
    humidity_pct: float
    rainfall_mm: float
