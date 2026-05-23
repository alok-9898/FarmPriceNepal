"""
FarmPriceNepal – Analytics Router
"""

from fastapi import APIRouter, Depends
from app.database import get_db

router = APIRouter()

@router.get("/summary")
async def get_summary(db=Depends(get_db)):
    # Aggregated stats for dashboard
    total_markets = await db.markets.count_documents({})
    total_commodities = await db.commodities.count_documents({})
    latest_prices = await db.prices.count_documents({})
    
    return {
        "total_markets": total_markets,
        "total_commodities": total_commodities,
        "latest_data_points": latest_prices,
        "active_models": 1
    }

@router.get("/volatility")
async def get_volatility(market_id: str, db=Depends(get_db)):
    # Calculate price volatility for a market
    pipeline = [
        {"$match": {"market_id": market_id}},
        {"$group": {
            "_id": "$commodity_id",
            "avg_price": {"$avg": "$price_npr"},
            "std_dev": {"$stdDevPop": "$price_npr"}
        }},
        {"$project": {
            "commodity_id": "$_id",
            "volatility": {"$divide": ["$std_dev", "$avg_price"]},
            "_id": 0
        }},
        {"$sort": {"volatility": -1}}
    ]
    results = await db.prices.aggregate(pipeline).to_list(100)
    return results
