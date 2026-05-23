"""
FarmPriceNepal – CSV/Excel Price Data Ingestion

Reads price CSV/Excel files and upserts into MongoDB prices collection.
"""

import pandas as pd
import sys
import os
import asyncio

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


async def ingest_prices_from_csv(filepath: str, db):
    """
    Read a CSV file and upsert into the prices collection.

    Expected columns: market_id, commodity_id, date, price_npr, unit
    """
    ext = os.path.splitext(filepath)[1].lower()
    if ext in [".xlsx", ".xls"]:
        df = pd.read_excel(filepath)
    else:
        df = pd.read_csv(filepath)

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # Validate required columns
    required = ["market_id", "commodity_id", "date", "price_npr"]
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

    # Clean data
    df["date"] = pd.to_datetime(df["date"]).dt.strftime("%Y-%m-%d")
    df["price_npr"] = pd.to_numeric(df["price_npr"], errors="coerce")
    df = df.dropna(subset=["price_npr"])

    if "unit" not in df.columns:
        df["unit"] = "kg"

    records = df.to_dict("records")
    inserted = 0
    skipped = 0
    errors = []

    for record in records:
        try:
            # Upsert: update if exists, insert if not
            result = await db.prices.update_one(
                {
                    "market_id": record["market_id"],
                    "commodity_id": record["commodity_id"],
                    "date": record["date"],
                },
                {"$set": record},
                upsert=True,
            )
            if result.upserted_id:
                inserted += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append(str(e))

    return {
        "records_inserted": inserted,
        "records_skipped": skipped,
        "errors": errors[:10],  # limit error messages
    }


async def seed_from_generated_data(db):
    """Seed the database from generated synthetic data files."""
    import json

    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")

    # Seed markets
    markets_file = os.path.join(data_dir, "markets.json")
    if os.path.exists(markets_file):
        with open(markets_file) as f:
            markets = json.load(f)
        for m in markets:
            await db.markets.update_one(
                {"market_id": m["market_id"]},
                {"$set": m},
                upsert=True,
            )
        print(f"[DONE] Seeded {len(markets)} markets")

    # Seed commodities
    commodities_file = os.path.join(data_dir, "commodities.json")
    if os.path.exists(commodities_file):
        with open(commodities_file) as f:
            commodities = json.load(f)
        for c in commodities:
            await db.commodities.update_one(
                {"commodity_id": c["commodity_id"]},
                {"$set": c},
                upsert=True,
            )
        print(f"[DONE] Seeded {len(commodities)} commodities")

    # Seed prices
    prices_file = os.path.join(data_dir, "prices.csv")
    if os.path.exists(prices_file):
        result = await ingest_prices_from_csv(prices_file, db)
        print(f"[DONE] Seeded prices: {result}")

    # Seed weather
    weather_file = os.path.join(data_dir, "weather.csv")
    if os.path.exists(weather_file):
        df = pd.read_csv(weather_file)
        records = df.to_dict("records")
        for r in records:
            await db.weather.update_one(
                {"location_id": r["location_id"], "date": r["date"]},
                {"$set": r},
                upsert=True,
            )
        print(f"[DONE] Seeded {len(records)} weather records")

    print("Database seeding complete!")
