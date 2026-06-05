
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

    # Run Exploratory Data Analysis (EDA) & Plotting
    print("Generating EDA Plots...")
    import matplotlib.pyplot as plt
    import seaborn as sns
    from etl.fetch_events import is_festival, is_monsoon
    
    plots_dir = os.path.join(os.path.dirname(__file__), 'plots')
    os.makedirs(plots_dir, exist_ok=True)
    
    df['date'] = pd.to_datetime(df['date'])
    df['is_monsoon'] = df['date'].apply(lambda x: 1 if is_monsoon(x.date()) else 0)
    df['is_festival'] = df['date'].apply(lambda x: 1 if is_festival(x.date()) else 0)
    
    # 1. Price Distribution Plot
    plt.figure(figsize=(10, 6))
    sns.histplot(data=df, x='price_npr', hue='commodity_id', kde=True, bins=50, multiple='stack', palette='viridis')
    plt.title('Distribution of Produce Prices in Nepal (NPR)', fontsize=14, fontweight='bold')
    plt.xlabel('Price (NPR / kg)', fontsize=12)
    plt.ylabel('Frequency', fontsize=12)
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, 'price_distribution.png'), dpi=150)
    plt.close()
    
    # 2. Weather Correlation Heatmap
    corr_cols = ['price_npr', 'temp_c', 'humidity_pct', 'rainfall_mm', 'is_monsoon', 'is_festival']
    corr_matrix = df[corr_cols].corr()
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".2f", linewidths=.5, square=True)
    plt.title('Weather & Market Price Correlation Heatmap', fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, 'weather_correlation_heatmap.png'), dpi=150)
    plt.close()
    
    # 3. Monsoon & Festival Impact Bar Charts
    plt.figure(figsize=(12, 5))
    plt.subplot(1, 2, 1)
    sns.barplot(data=df, x='commodity_id', y='price_npr', hue='is_monsoon', palette='Blues_r', errorbar=None)
    plt.title('Monsoon Shock on Crop Prices', fontsize=12, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('Crop', fontsize=10)
    plt.ylabel('Average Price (NPR)', fontsize=10)
    
    plt.subplot(1, 2, 2)
    sns.barplot(data=df, x='commodity_id', y='price_npr', hue='is_festival', palette='Oranges_r', errorbar=None)
    plt.title('Festival Shock on Crop Prices', fontsize=12, fontweight='bold')
    plt.xticks(rotation=45, ha='right')
    plt.xlabel('Crop', fontsize=10)
    plt.ylabel('Average Price (NPR)', fontsize=10)
    
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, 'monsoon_festival_shocks.png'), dpi=150)
    plt.close()
    
    print(f"EDA Plots successfully saved to {plots_dir}")

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
