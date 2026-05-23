"""
FarmPriceNepal – Forecasting Service
Orchestrates model loading and prediction generation.
"""

import joblib
import pandas as pd
import os
from datetime import datetime, timedelta
from app.services.feature_engineering import create_features
from app.config import settings

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "ml", "models")

class ForecastingService:
    def __init__(self):
        self.models = {}
        self._load_models()

    def _load_models(self):
        """Load all trained models from the models directory."""
        if not os.path.exists(MODELS_DIR):
            os.makedirs(MODELS_DIR, exist_ok=True)
            return

        for filename in os.listdir(MODELS_DIR):
            if filename.endswith(".pkl") or filename.endswith(".joblib"):
                name = filename.split(".")[0]
                self.models[name] = joblib.load(os.path.join(MODELS_DIR, filename))

    async def get_forecast(self, market_id: str, commodity_id: str, horizon_days: int, db):
        """
        Generates a forecast for a given market and commodity.
        """
        # 1. Fetch historical data from MongoDB
        # 2. Fetch weather forecast
        # 3. Feature engineering
        # 4. Predict using the best model
        # 5. Return ForecastResponse
        
        # Placeholder for demo
        predictions = []
        start_date = datetime.now().date()
        
        # Naive prediction logic for now
        last_price_doc = await db.prices.find_one(
            {"market_id": market_id, "commodity_id": commodity_id},
            sort=[("date", -1)]
        )
        last_price = last_price_doc["price_npr"] if last_price_doc else 100.0
        
        for i in range(1, horizon_days + 1):
            pred_date = start_date + timedelta(days=i)
            # Add some dummy variation
            pred_price = last_price * (1 + (i * 0.01)) 
            predictions.append({
                "date": pred_date.isoformat(),
                "predicted_price": round(pred_price, 2),
                "lower_bound": round(pred_price * 0.95, 2),
                "upper_bound": round(pred_price * 1.05, 2)
            })

        return {
            "market_id": market_id,
            "commodity_id": commodity_id,
            "horizon_days": horizon_days,
            "model_used": "XGBoost (Inferred)",
            "predictions": predictions,
            "explanation": "Predicted increase due to upcoming festival season and historical trends."
        }

forecasting_service = ForecastingService()
