
import asyncio
from app.database import connect_to_mongo, get_db, close_mongo_connection
from etl.ingest_prices import seed_from_generated_data

async def main():
    await connect_to_mongo()
    db = get_db()
    await seed_from_generated_data(db)
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(main())
