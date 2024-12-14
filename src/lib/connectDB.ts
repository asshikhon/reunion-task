import { MongoClient, ServerApiVersion, Db } from "mongodb";

let db: Db | undefined;

export const connectDB = async (): Promise<Db | undefined> => {
    if (db) return db;
    try {
        const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
        if (!uri) {
            throw new Error("MongoDB URI is not defined in environment variables.");
        }

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        db = client.db("reunion");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return undefined;
    }
};
