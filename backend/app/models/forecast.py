"""
Pydantic models – Forecast
"""

from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Optional, List


class ForecastRequest(BaseModel):
    market_id: str
    commodity_id: str
    horizon_days: int = Field(default=7, ge=1, le=90)


class ForecastPoint(BaseModel):
    date: date
    predicted_price: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None


class ForecastResponse(BaseModel):
    market_id: str
    commodity_id: str
    market_name: Optional[str] = None
    commodity_name: Optional[str] = None
    forecast_date: datetime = Field(default_factory=datetime.utcnow)
    horizon_days: int
    model_used: str
    predictions: List[ForecastPoint]
    feature_importances: Optional[dict] = None
    explanation: Optional[str] = None


class BulkForecastRequest(BaseModel):
    queries: List[ForecastRequest]


class BulkForecastResponse(BaseModel):
    forecasts: List[ForecastResponse]
    total: int


class ForecastInDB(BaseModel):
    market_id: str
    commodity_id: str
    forecast_date: datetime
    horizon_days: int
    predicted_price: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    model_used: str
