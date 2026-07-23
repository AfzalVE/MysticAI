import asyncio
import os
import sys

# Add the backend directory to sys.path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import connect_to_mongo, get_database

async def main():
    await connect_to_mongo()
    db = get_database()
    result = await db.users.update_one(
        {"email": "afzal@example.com"}, 
        {"$set": {"is_admin": False}}
    )
    print(f"Updated {result.modified_count} users to regular user.")

if __name__ == "__main__":
    asyncio.run(main())
