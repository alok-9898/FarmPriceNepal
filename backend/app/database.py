"""
FarmPriceNepal – MongoDB Connection (Motor async driver)
"""

import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from app.config import settings

# Setup logging
logger = logging.getLogger("uvicorn.error")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    """Create MongoDB connection on startup."""
    if db_instance.client is not None:
        return
        
    try:
        # Use a timeout so it doesn't hang forever if MongoDB is down
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            uuidRepresentation="standard"
        )
        
        # Verify connection
        await db_instance.client.admin.command('ping')
        
        db_instance.db = db_instance.client[settings.MONGODB_DB]
        
        # Create indexes for performance and uniqueness
        await db_instance.db.users.create_index("email", unique=True)
        await db_instance.db.prices.create_index([("market_id", 1), ("commodity_id", 1), ("date", -1)])
        await db_instance.db.forecasts.create_index([("market_id", 1), ("commodity_id", 1), ("forecast_date", -1)])
        await db_instance.db.weather.create_index([("location_id", 1), ("date", -1)])
        await db_instance.db.alerts.create_index("user_id")

        logger.info(f"✅ Successfully connected to MongoDB: {settings.MONGODB_DB}")
        
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error(f"❌ Could not connect to MongoDB: {e}")
        # In a real app, we might want to retry here
        raise e
    except Exception as e:
        logger.error(f"❌ An unexpected error occurred while connecting to MongoDB: {e}")
        raise e

async def close_mongo_connection():
    """Close MongoDB connection on shutdown."""
    if db_instance.client:
        db_instance.client.close()
        db_instance.client = None
        db_instance.db = None
        logger.info("🔒 MongoDB connection closed.")

def get_db():
    """Return the database instance, ensuring it exists."""
    if db_instance.db is None:
        logger.critical("🚨 Database instance is None! Database connection might have failed.")
        raise RuntimeError("Database connection not established.")
    return db_instance.db
