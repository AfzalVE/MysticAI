import asyncio
import os
import sys

# Add the backend directory to sys.path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import connect_to_mongo, get_database
from app.core.security import get_password_hash

async def main():
    await connect_to_mongo()
    db = get_database()
    
    admin_user = {
        "name": "Super Admin",
        "email": "admin@mysticai.com",
        "hashed_password": get_password_hash("admin123"),
        "is_admin": True
    }
    
    # check if exists
    existing = await db.users.find_one({"email": admin_user["email"]})
    if existing:
        await db.users.update_one({"email": admin_user["email"]}, {"$set": admin_user})
        print("Updated admin@mysticai.com")
    else:
        await db.users.insert_one(admin_user)
        print("Created admin@mysticai.com")

if __name__ == "__main__":
    asyncio.run(main())
