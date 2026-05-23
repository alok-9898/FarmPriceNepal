"""
FarmPriceNepal – Forecasting Router
"""

from fastapi import APIRouter, Depends
from app.models import ForecastResponse, BulkForecastRequest, BulkForecastResponse
from app.database import get_db
from app.services.forecasting_service import forecasting_service

router = APIRouter()

@router.get("/", response_model=ForecastResponse)
async def get_forecast(market_id: str, commodity_id: str, horizon: int = 7, db=Depends(get_db)):
    forecast = await forecasting_service.get_forecast(market_id, commodity_id, horizon, db)
    return forecast

@router.post("/bulk", response_model=BulkForecastResponse)
async def bulk_forecast(request: BulkForecastRequest, db=Depends(get_db)):
    forecasts = []
    for q in request.queries:
        f = await forecasting_service.get_forecast(q.market_id, q.commodity_id, q.horizon_days, db)
        forecasts.append(f)
    return {"forecasts": forecasts, "total": len(forecasts)}
