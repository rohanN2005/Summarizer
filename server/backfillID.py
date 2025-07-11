import os
from dotenv import load_dotenv, find_dotenv
from pymongo import MongoClient
from bson import ObjectId

# load env
ENV_FILE = find_dotenv()
if ENV_FILE:
    load_dotenv(ENV_FILE)

uri = os.environ["CONNECTION_STRING"]
client = MongoClient(uri)
db     = client.get_default_database()
coll   = db.user_summaries

updated = 0
for doc in coll.find({}):
    changed = False
    for s in doc.get("summaries", []):
        if "_id" not in s:
            s["_id"] = ObjectId()
            changed = True
    if changed:
        coll.replace_one({"_id": doc["_id"]}, doc)