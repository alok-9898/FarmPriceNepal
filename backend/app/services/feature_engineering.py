"""
FarmPriceNepal – Feature Engineering Service
Handles lag features, rolling windows, time features, and weather integration for ML.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from etl.fetch_events import is_festival, is_monsoon

def create_features(df, include_target=True):
    """
    Transform raw price and weather data into a feature-rich dataframe for ML.
    df should contain: market_id, commodity_id, date, price_npr, temp_c, humidity_pct, rainfall_mm
    """
    # Ensure date is datetime
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['market_id', 'commodity_id', 'date'])

    # 1. Time Features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['quarter'] = df['date'].dt.quarter
    df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)
    
    # 2. Nepal-specific Features
    df['is_monsoon'] = df['date'].apply(lambda x: 1 if is_monsoon(x.date()) else 0)
    df['is_festival'] = df['date'].apply(lambda x: 1 if is_festival(x.date()) else 0)

    # 3. Lag Features (Shifted prices)
    # Group by market and commodity to ensure lags don't leak between different series
    grouped = df.groupby(['market_id', 'commodity_id'])
    
    df['price_lag_1'] = grouped['price_npr'].shift(1)
    df['price_lag_7'] = grouped['price_npr'].shift(7)
    df['price_lag_30'] = grouped['price_npr'].shift(30)

    # 4. Rolling Window Features
    df['rolling_mean_7'] = grouped['price_npr'].transform(lambda x: x.rolling(window=7).mean())
    df['rolling_std_7'] = grouped['price_npr'].transform(lambda x: x.rolling(window=7).std())
    df['rolling_mean_30'] = grouped['price_npr'].transform(lambda x: x.rolling(window=30).mean())
    
    # 5. Price Momentum/Change
    df['price_change_1d'] = df['price_npr'] - df['price_lag_1']
    df['price_change_7d'] = df['price_npr'] - df['price_lag_7']

    # 6. Interaction Features (Weather & Price)
    # Higher rainfall in monsoon might impact prices differently than in winter
    df['rain_x_monsoon'] = df['rainfall_mm'] * df['is_monsoon']

    # Handle missing values created by lags/rolling windows
    # For a real production app, we might want to be more careful here
    df = df.dropna() if include_target else df.fillna(method='ffill').fillna(0)

    return df

def prepare_inference_data(historical_prices, weather_forecast, market_id, commodity_id, horizon_days):
    """
    Prepares a dataframe for future predictions.
    """
    # Logic to create future dates and merge with weather forecast
    # Then apply create_features
    pass
