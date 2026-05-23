
import asyncio
import uuid
from datetime import datetime
from app.database import connect_to_mongo, get_db, close_mongo_connection
from app.services.auth_service import get_password_hash

async def seed_users():
    await connect_to_mongo()
    db = get_db()
    
    # Define roles to seed (matches the roles available on the Register page)
    roles = ["farmer", "trader", "cooperative", "analyst"]
    password = "password123"
    hashed_password = get_password_hash(password)
    
    print(f"Seeding dummy users with password: {password}")
    
    for role in roles:
        email = f"{role}@test.com".lower()
        # Check if user exists
        existing = await db.users.find_one({"email": email})
        if not existing:
            user_dict = {
                "user_id": str(uuid.uuid4()),
                "name": f"Test {role.capitalize()}",
                "email": email,
                "hashed_password": hashed_password,
                "role": role,
                "market_preferences": [],
                "created_at": datetime.utcnow()
            }
            await db.users.insert_one(user_dict)
            print(f"Created user: {email} ({role})")
        else:
            print(f"User {email} already exists.")
            
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed_users())
