
import pandas as pd
import numpy as np
import joblib
import os
import sys
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Add parent dir to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from app.services.feature_engineering import create_features

def train():
    print("--- Starting AI Model Training ---")
    
    # 1. Load Data
    data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data')
    prices_path = os.path.join(data_dir, 'prices.csv')
    weather_path = os.path.join(data_dir, 'weather.csv')
    
    if not os.path.exists(prices_path) or not os.path.exists(weather_path):
        print(f"Error: Data files not found in {data_dir}")
        return

    prices_df = pd.read_csv(prices_path)
    weather_df = pd.read_csv(weather_path)

    # Merge data
    df = pd.merge(prices_df, weather_df, left_on=['market_id', 'date'], right_on=['location_id', 'date'])
    df.drop(columns=['location_id'], inplace=True)
    print(f"Loaded {len(df)} records")

    # 2. Feature Engineering
    featured_df = create_features(df)
    print(f"Features created. Shape: {featured_df.shape}")

    # 3. Train-Test Split (Time-based)
    featured_df = featured_df.sort_values('date')
    split_idx = int(len(featured_df) * 0.8)

    train_df = featured_df.iloc[:split_idx]
    test_df = featured_df.iloc[split_idx:]

    features = [
        'day_of_week', 'month', 'is_weekend', 'is_monsoon', 'is_festival',
        'price_lag_1', 'price_lag_7', 'price_lag_30',
        'rolling_mean_7', 'rolling_std_7', 'rolling_mean_30',
        'temp_c', 'humidity_pct', 'rainfall_mm', 'rain_x_monsoon'
    ]
    target = 'price_npr'

    X_train, y_train = train_df[features], train_df[target]
    X_test, y_test = test_df[features], test_df[target]

    # 4. Train XGBoost Model
    print("Training XGBoost Regressor...")
    # Using early_stopping_rounds in constructor for newer XGBoost compatibility
    model = XGBRegressor(n_estimators=1000, learning_rate=0.05, max_depth=6, early_stopping_rounds=50)
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)

    print("Model training complete")

    # 5. Evaluate
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100

    print(f"Evaluation Results:")
    print(f"  MAE: {mae:.2f} NPR")
    print(f"  RMSE: {rmse:.2f} NPR")
    print(f"  MAPE: {mape:.2f}%")

    # 6. Save Model
    model_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'primary_price_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train()
