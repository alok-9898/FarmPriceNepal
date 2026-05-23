"""
FarmPriceNepal – Synthetic Data Generator

Generates 2 years of realistic market price data for Nepal's fresh produce markets.
Encodes: monsoon seasonality (Jun–Sep), Dashain/Tihar festival spikes,
weekly patterns, and market-specific price levels.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta, date
import json
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


# ─── Nepal Markets ───────────────────────────────────────────────
MARKETS = [
    {"market_id": "kalimati", "name": "Kalimati Fruits & Vegetables Market", "district": "Kathmandu", "province": "Bagmati", "latitude": 27.6933, "longitude": 85.2862},
    {"market_id": "asan", "name": "Asan Bazaar", "district": "Kathmandu", "province": "Bagmati", "latitude": 27.7079, "longitude": 85.3120},
    {"market_id": "banepa", "name": "Banepa Market", "district": "Kavrepalanchok", "province": "Bagmati", "latitude": 27.6314, "longitude": 85.5219},
    {"market_id": "pokhara", "name": "Pokhara Sabji Mandi", "district": "Kaski", "province": "Gandaki", "latitude": 28.2096, "longitude": 83.9856},
    {"market_id": "birgunj", "name": "Birgunj Market", "district": "Parsa", "province": "Madhesh", "latitude": 27.0104, "longitude": 84.8821},
    {"market_id": "dhangadhi", "name": "Dhangadhi Bazaar", "district": "Kailali", "province": "Sudurpashchim", "latitude": 28.6942, "longitude": 80.5936},
    {"market_id": "butwal", "name": "Butwal Market", "district": "Rupandehi", "province": "Lumbini", "latitude": 27.7006, "longitude": 83.4483},
    {"market_id": "janakpur", "name": "Janakpur Mandi", "district": "Dhanusha", "province": "Madhesh", "latitude": 26.7288, "longitude": 85.9263},
]

# ─── Commodities with base prices (NPR/kg) ──────────────────────
COMMODITIES = [
    {"commodity_id": "tomato", "name": "Tomato (Golbheda)", "category": "vegetable", "base_price": 60, "volatility": 0.35},
    {"commodity_id": "potato", "name": "Potato (Aalu)", "category": "vegetable", "base_price": 40, "volatility": 0.15},
    {"commodity_id": "onion", "name": "Onion (Pyaaj)", "category": "vegetable", "base_price": 55, "volatility": 0.30},
    {"commodity_id": "cauliflower", "name": "Cauliflower (Kauli)", "category": "vegetable", "base_price": 45, "volatility": 0.25},
    {"commodity_id": "cabbage", "name": "Cabbage (Bandakopi)", "category": "vegetable", "base_price": 35, "volatility": 0.20},
    {"commodity_id": "green_beans", "name": "Green Beans (Simi)", "category": "vegetable", "base_price": 70, "volatility": 0.28},
    {"commodity_id": "spinach", "name": "Spinach (Palungo)", "category": "vegetable", "base_price": 50, "volatility": 0.22},
    {"commodity_id": "apple", "name": "Apple (Syau)", "category": "fruit", "base_price": 180, "volatility": 0.20},
    {"commodity_id": "banana", "name": "Banana (Kera)", "category": "fruit", "base_price": 80, "volatility": 0.15},
    {"commodity_id": "orange", "name": "Orange (Suntala)", "category": "fruit", "base_price": 120, "volatility": 0.25},
    {"commodity_id": "rice", "name": "Rice (Chamal)", "category": "staple", "base_price": 65, "volatility": 0.08},
    {"commodity_id": "lentil", "name": "Lentil (Dal)", "category": "staple", "base_price": 130, "volatility": 0.10},
    {"commodity_id": "mustard_oil", "name": "Mustard Oil (Tori ko Tel)", "category": "staple", "base_price": 260, "volatility": 0.12},
    {"commodity_id": "chili", "name": "Chili (Khursani)", "category": "spice", "base_price": 90, "volatility": 0.40},
    {"commodity_id": "ginger", "name": "Ginger (Aduwa)", "category": "spice", "base_price": 100, "volatility": 0.30},
]

# ─── Nepali Festival Calendar (approx Gregorian dates) ──────────
# These are approximate fixed-date analogs for the hackathon demo
FESTIVALS = {
    2024: [
        {"name": "Holi", "start": date(2024, 3, 25), "end": date(2024, 3, 26), "price_bump": 0.08},
        {"name": "Teej", "start": date(2024, 9, 6), "end": date(2024, 9, 7), "price_bump": 0.10},
        {"name": "Dashain", "start": date(2024, 10, 3), "end": date(2024, 10, 15), "price_bump": 0.25},
        {"name": "Tihar", "start": date(2024, 11, 1), "end": date(2024, 11, 5), "price_bump": 0.20},
        {"name": "Chhath", "start": date(2024, 11, 7), "end": date(2024, 11, 8), "price_bump": 0.07},
    ],
    2025: [
        {"name": "Holi", "start": date(2025, 3, 14), "end": date(2025, 3, 15), "price_bump": 0.08},
        {"name": "Teej", "start": date(2025, 8, 26), "end": date(2025, 8, 27), "price_bump": 0.10},
        {"name": "Dashain", "start": date(2025, 9, 22), "end": date(2025, 10, 4), "price_bump": 0.25},
        {"name": "Tihar", "start": date(2025, 10, 20), "end": date(2025, 10, 24), "price_bump": 0.20},
        {"name": "Chhath", "start": date(2025, 10, 26), "end": date(2025, 10, 27), "price_bump": 0.07},
    ],
    2026: [
        {"name": "Holi", "start": date(2026, 3, 3), "end": date(2026, 3, 4), "price_bump": 0.08},
        {"name": "Teej", "start": date(2026, 8, 16), "end": date(2026, 8, 17), "price_bump": 0.10},
        {"name": "Dashain", "start": date(2026, 10, 12), "end": date(2026, 10, 24), "price_bump": 0.25},
        {"name": "Tihar", "start": date(2026, 11, 9), "end": date(2026, 11, 13), "price_bump": 0.20},
        {"name": "Chhath", "start": date(2026, 11, 15), "end": date(2026, 11, 16), "price_bump": 0.07},
    ],
}

# Market price multipliers (distance from Kathmandu, supply chain costs)
MARKET_MULTIPLIERS = {
    "kalimati": 1.0,
    "asan": 1.05,
    "banepa": 0.92,
    "pokhara": 1.10,
    "birgunj": 0.88,
    "dhangadhi": 1.15,
    "butwal": 0.95,
    "janakpur": 0.90,
}


def is_monsoon(d: date) -> bool:
    """June–September monsoon season."""
    return d.month in [6, 7, 8, 9]


def get_festival_bump(d: date) -> float:
    """Return festival price bump multiplier for a date."""
    year_festivals = FESTIVALS.get(d.year, [])
    for fest in year_festivals:
        if fest["start"] <= d <= fest["end"]:
            return fest["price_bump"]
    return 0.0


def get_festival_name(d: date) -> str:
    """Return festival name if date falls in festival period."""
    year_festivals = FESTIVALS.get(d.year, [])
    for fest in year_festivals:
        if fest["start"] <= d <= fest["end"]:
            return fest["name"]
    return ""


def generate_price_series(commodity: dict, market_id: str,
                          start_date: date, end_date: date,
                          rng: np.random.Generator) -> list:
    """
    Generate a realistic daily price series for a commodity at a market.
    """
    base = commodity["base_price"] * MARKET_MULTIPLIERS[market_id]
    vol = commodity["volatility"]
    records = []

    current = start_date
    price = base
    trend = rng.uniform(-0.0001, 0.0003)  # slight upward inflation trend

    while current <= end_date:
        # Day-of-week effect (weekend dips from lower supply)
        dow = current.weekday()
        dow_effect = 1.0
        if dow == 5:  # Saturday (Nepal weekend)
            dow_effect = 0.97
        elif dow == 4:  # Friday – pre-weekend stocking
            dow_effect = 1.02

        # Seasonal effect: monsoon raises veggie prices
        season_effect = 1.0
        if is_monsoon(current) and commodity["category"] == "vegetable":
            season_effect = 1.15 + rng.uniform(0, 0.10)
        elif is_monsoon(current) and commodity["category"] == "fruit":
            season_effect = 1.08

        # Winter (Dec–Feb): higher prices for some items
        if current.month in [12, 1, 2] and commodity["category"] in ["vegetable", "fruit"]:
            season_effect *= 1.05

        # Festival demand spike
        fest_bump = get_festival_bump(current)
        fest_effect = 1.0 + fest_bump

        # Random walk with mean reversion
        shock = rng.normal(0, vol * base * 0.02)
        mean_reversion = (base * MARKET_MULTIPLIERS[market_id] - price) * 0.03
        price += shock + mean_reversion + trend * base

        # Apply all effects
        final_price = price * dow_effect * season_effect * fest_effect
        final_price = max(final_price, base * 0.3)  # floor
        final_price = round(final_price, 2)

        records.append({
            "market_id": market_id,
            "commodity_id": commodity["commodity_id"],
            "date": current.isoformat(),
            "price_npr": final_price,
            "unit": "kg",
        })

        current += timedelta(days=1)

    return records


def generate_weather_data(market: dict, start_date: date, end_date: date,
                          rng: np.random.Generator) -> list:
    """Generate synthetic weather data for a market location."""
    records = []
    current = start_date

    while current <= end_date:
        month = current.month

        # Temperature: subtropical pattern
        if month in [6, 7, 8]:  # summer/monsoon
            base_temp = 28 + rng.normal(0, 3)
        elif month in [12, 1, 2]:  # winter
            base_temp = 12 + rng.normal(0, 4)
        else:  # spring/autumn
            base_temp = 22 + rng.normal(0, 3)

        # Altitude adjustment (Kathmandu ~1400m vs Birgunj ~100m)
        if market["latitude"] > 28:
            base_temp -= 4
        elif market["latitude"] < 27.5:
            base_temp += 2

        # Rainfall: heavy in monsoon
        if month in [6, 7, 8, 9]:
            rainfall = max(0, rng.exponential(15) + rng.uniform(0, 20))
        elif month in [12, 1, 2]:
            rainfall = max(0, rng.exponential(1))
        else:
            rainfall = max(0, rng.exponential(5))

        # Humidity
        humidity = min(100, max(20, 60 + (rainfall * 0.5) + rng.normal(0, 8)))

        records.append({
            "location_id": market["market_id"],
            "date": current.isoformat(),
            "temp_c": round(base_temp, 1),
            "humidity_pct": round(humidity, 1),
            "rainfall_mm": round(rainfall, 1),
        })

        current += timedelta(days=1)

    return records


def generate_all_data():
    """Generate all synthetic data and save to JSON files."""
    rng = np.random.default_rng(42)

    start_date = date(2024, 1, 1)
    end_date = date(2025, 12, 31)

    print("--- Generating synthetic Nepal market data ---")
    print(f"   Period: {start_date} to {end_date}")
    print(f"   Markets: {len(MARKETS)}")
    print(f"   Commodities: {len(COMMODITIES)}")

    # Generate prices
    all_prices = []
    for market in MARKETS:
        for commodity in COMMODITIES:
            prices = generate_price_series(commodity, market["market_id"],
                                           start_date, end_date, rng)
            all_prices.extend(prices)
            print(f"   [DONE] {market['name'][:20]:20s} x {commodity['name'][:20]:20s}: {len(prices)} days")

    # Generate weather
    all_weather = []
    for market in MARKETS:
        weather = generate_weather_data(market, start_date, end_date, rng)
        all_weather.extend(weather)
        print(f"   [WEATHER] Weather for {market['name'][:30]:30s}: {len(weather)} days")

    # Generate festival events
    all_events = []
    for year, festivals in FESTIVALS.items():
        for fest in festivals:
            current = fest["start"]
            while current <= fest["end"]:
                all_events.append({
                    "date": current.isoformat(),
                    "event_name": fest["name"],
                    "price_impact_pct": fest["price_bump"] * 100,
                    "year": year,
                })
                current += timedelta(days=1)

    # Save to data directory
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(data_dir, exist_ok=True)

    # Save markets
    with open(os.path.join(data_dir, "markets.json"), "w") as f:
        json.dump(MARKETS, f, indent=2)

    # Save commodities
    commodities_clean = [{k: v for k, v in c.items() if k != "volatility" and k != "base_price"}
                         for c in COMMODITIES]
    with open(os.path.join(data_dir, "commodities.json"), "w") as f:
        json.dump(commodities_clean, f, indent=2)

    # Save prices as CSV (more efficient for large datasets)
    df_prices = pd.DataFrame(all_prices)
    df_prices.to_csv(os.path.join(data_dir, "prices.csv"), index=False)
    print(f"\n[DATA] Total price records: {len(all_prices):,}")

    # Save weather
    df_weather = pd.DataFrame(all_weather)
    df_weather.to_csv(os.path.join(data_dir, "weather.csv"), index=False)
    print(f"[WEATHER] Total weather records: {len(all_weather):,}")

    # Save events
    with open(os.path.join(data_dir, "events.json"), "w") as f:
        json.dump(all_events, f, indent=2)
    print(f"[EVENTS] Total event records: {len(all_events)}")

    print(f"\n[DONE] All data saved to: {os.path.abspath(data_dir)}")

    return {
        "markets": MARKETS,
        "commodities": commodities_clean,
        "prices_count": len(all_prices),
        "weather_count": len(all_weather),
        "events_count": len(all_events),
    }


if __name__ == "__main__":
    generate_all_data()
