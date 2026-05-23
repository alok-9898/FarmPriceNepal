"""
FarmPriceNepal – Weather Data Fetcher
Fetches weather from OpenWeatherMap API for Nepali market cities.
"""

import httpx
from datetime import datetime, date
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

NEPAL_CITIES = {
    "kalimati": {"lat": 27.6933, "lon": 85.2862},
    "asan": {"lat": 27.7079, "lon": 85.3120},
    "banepa": {"lat": 27.6314, "lon": 85.5219},
    "pokhara": {"lat": 28.2096, "lon": 83.9856},
    "birgunj": {"lat": 27.0104, "lon": 84.8821},
    "dhangadhi": {"lat": 28.6942, "lon": 80.5936},
    "butwal": {"lat": 27.7006, "lon": 83.4483},
    "janakpur": {"lat": 26.7288, "lon": 85.9263},
}


async def fetch_current_weather(api_key: str, location_id: str) -> dict:
    city = NEPAL_CITIES.get(location_id)
    if not city:
        return None
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {"lat": city["lat"], "lon": city["lon"], "appid": api_key, "units": "metric"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        if resp.status_code == 200:
            data = resp.json()
            return {
                "location_id": location_id,
                "date": date.today().isoformat(),
                "temp_c": round(data["main"]["temp"], 1),
                "humidity_pct": data["main"]["humidity"],
                "rainfall_mm": round(data.get("rain", {}).get("1h", 0), 1),
            }
    return None


async def fetch_all_weather(api_key: str, db):
    if not api_key:
        print("⚠️  No OpenWeatherMap API key — skipping.")
        return
    print("🌤 Fetching weather for Nepal markets...")
    for loc_id in NEPAL_CITIES:
        current = await fetch_current_weather(api_key, loc_id)
        if current:
            await db.weather.update_one(
                {"location_id": loc_id, "date": current["date"]},
                {"$set": current}, upsert=True,
            )
            print(f"   ✓ {loc_id}: {current['temp_c']}°C")
    print("✅ Weather fetch complete!")
