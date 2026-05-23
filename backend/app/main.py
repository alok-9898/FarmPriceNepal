"""
FarmPriceNepal – Main Application Entry Point
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import auth, markets, commodities, prices, forecast, analytics, alerts, fintech

app = FastAPI(
    title="FarmPriceNepal API",
    description="AI-powered forecasting platform for Nepal's fresh produce markets",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Events
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Health Check
@app.get("/health", tags=["General"])
async def health_check():
    return {"status": "healthy", "service": "FarmPriceNepal API"}

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(markets.router, prefix="/markets", tags=["Markets"])
app.include_router(commodities.router, prefix="/commodities", tags=["Commodities"])
app.include_router(prices.router, prefix="/prices", tags=["Prices"])
app.include_router(forecast.router, prefix="/forecast", tags=["Forecasting"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
app.include_router(alerts.router, prefix="/alerts", tags=["Alerts"])
app.include_router(fintech.router, prefix="/fintech", tags=["Fintech Integration"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
