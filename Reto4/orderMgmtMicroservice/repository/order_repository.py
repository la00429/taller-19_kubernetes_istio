from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client["OrderDB"]
collection = db["Order"]


async def create_order_doc(doc: dict) -> bool:
    try:
        await collection.insert_one(doc)
        return True
    except Exception:
        return False


async def update_order_status_doc(orderID: str, status: str) -> bool:
    result = await collection.update_one({"orderID": orderID}, {"$set": {"status": status}})
    return result.matched_count > 0


async def find_by_customerid_doc(customerid: str) -> List[dict]:
    cursor = collection.find({"customerid": customerid})
    items = []
    async for d in cursor:
        items.append({
            "customerid": d.get("customerid"),
            "orderID": d.get("orderID"),
            "status": d.get("status"),
        })
    return items
