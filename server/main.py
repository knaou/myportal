import os
from urllib.parse import urlparse

import uvicorn
from typing import Optional, List
from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
from bson.objectid import ObjectId
from starlette.middleware.cors import CORSMiddleware


class Entry(BaseModel):
    id: str = None
    enabled: bool = True
    image: Optional[str]
    title: str
    description: Optional[str]
    category: str = 'default'
    linkto: Optional[str]
    tags: Optional[List[str]] = []

    class Config:
        fields = {'id': '_id'}

    @staticmethod
    def from_mongo(d):
        if '_id' in d:
            d['_id'] = str(d['_id'])
        return Entry(**d)

    def to_mongo(self):
        ret = dict(self)
        if '_id' in ret:
            ret._id = ObjectId(ret._id)
        return ret


app = FastAPI()
mongoClient = MongoClient(os.environ.get('MONGO_URI', 'mongodb://localhost/myportal'))
mongo = mongoClient.get_default_database()

APP_URL = urlparse(os.environ.get('APP_URL', 'http://localhost:8080'))
origins = [f"{APP_URL.scheme}://{APP_URL.netloc}"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["DELETE,GET,POST,PUT"],
    allow_headers=["*"])


@app.get("/d/links")
async def links_list() -> List[Entry]:
    return {"links": [Entry.from_mongo(row) for row in mongo.links.find()]}


@app.post("/d/links")
async def links_post(entry: Entry) -> Entry:
    _id = mongo.links.insert_one(entry.to_mongo()).inserted_id
    return Entry.from_mongo(mongo.links.find_one({'_id': _id}))


@app.get("/d/links/{link_id}")
async def links_get(link_id: str) -> Entry:
    return Entry.from_mongo(mongo.links.find_one({'_id': ObjectId(link_id)}))


@app.put("/d/links/{link_id}")
async def links_edit(link_id: str, entry: Entry) -> Entry:
    oid = ObjectId(link_id)
    mongo.links.update_one({'_id': oid}, {'$set': entry.to_mongo()})
    return Entry.from_mongo(mongo.links.find_one({'_id': oid}))


@app.delete("/d/links/{link_id}")
async def links_remove(link_id: str) -> Entry:
    oid = ObjectId(link_id)
    mongo.links.delete_one({'_id': oid})
    return {'_id': link_id}


@app.get("/d/synonyms")
async def synonyms_list():
    return {
        'categories': mongo.links.find({'category': {'$ne': None}}).distinct('category'),
        'tags': mongo.links.find({'tags': {'$ne': None}}).distinct('tags'),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5000, debug=True)
