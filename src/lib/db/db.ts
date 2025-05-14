"use server";

import { User } from "@/lib/db/models/user";
import { Collection, Document, MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // in development mode, use a global variable so that the value is preserved across module reloads caused by Hot Module Replacement
    let globalWithMongo = global as typeof global & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    // in production mode, its best to not use a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// export default clientPromise;
export default async function getMongoClient() {
    return await clientPromise;
}

export async function getCollection<T = any>(
    collectionName: string
): Promise<Collection<T & Document>> {
    const client = await clientPromise;
    const db = client.db("classifieds");
    return db.collection<T & Document>(collectionName);
}

// function to get user collection
export async function getUserCollection() {
    return getCollection<User>("users");
}
