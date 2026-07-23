import asyncio
import os
import sys

# Add the backend directory to sys.path so we can import app modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import connect_to_mongo, get_database

async def main():
    await connect_to_mongo()
    db = get_database()
    cursor = db.users.find({})
    users = await cursor.to_list(length=100)
    for u in users:
        print(f"Email: {u.get('email')}, Admin: {u.get('is_admin')}")

if __name__ == "__main__":
    asyncio.run(main())
