const { ObjectId, MongoClient } = require('mongodb');

const MONGO_URI = "mongodb://127.0.0.1:27017"
const DB_NAME = "social-app";

let client;

const connectDB = async () => {
    if (!client) {
        client = new MongoClient(MONGO_URI);
        await client.connect();
    }
    return client;
}

const handler = async (event) => {
    const client = await connectDB();
    const db = client.db(DB_NAME);
    const users = await db.collection('users');
    for (const record of event.Records) {
        try {
            let fullKey = decodeURIComponent(
                record.s3.object.key.replace(/\+/g, " ")
            );
            console.log("s3 key", fullKey);
            const parts = fullKey.split("/");
            const userId = parts[2];
            const result = await users.updateOne(
                { _id: new ObjectId(userId) }, {
                $set: {
                    profilePic: fullKey,
                    updateAt: new Date()
                }
            });
        }
        catch (error) {
            console.log("Lamda error for record", error);
        }
    }
    return { statusCode: 200 };
}
//the above function is written in aws server but the first line is import{ObjectId,MongoClient}from "Mongodb"
//and in handler we write before it export
// the handler we write after it is made automatically by aws s3 server
handler({
    Records:
        [
            {
                s3:
                {
                    object:
                    {
                        key:
                            "social_app/user/6a2a9ead6e8f5c1188142cf9/1782206104795/_أضرار التدخين.jpg"
                    }
                }
            }
        ]
})