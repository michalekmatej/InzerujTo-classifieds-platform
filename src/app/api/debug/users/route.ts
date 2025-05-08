import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { MongoClient } from "mongodb";

// WARNING: This is a debug-only endpoint and should be removed in production
// It exposes user data which could be a security risk

export async function GET() {
    try {
        console.log("Debug: Attempting to connect to MongoDB");
        let client: MongoClient;

        try {
            client = await clientPromise;
            console.log("Debug: MongoDB connection established");
        } catch (err: any) {
            console.error("Debug: MongoDB connection failed", err);
            return NextResponse.json(
                {
                    status: "error",
                    message: "MongoDB connection failed",
                    error: err.message,
                },
                { status: 500 }
            );
        }

        const db = client.db("classifieds");
        console.log("Debug: Using classifieds database");

        // Test write operation to see if we have write permissions
        console.log("Debug: Testing write permission with test document");
        try {
            const testResult = await db.collection("_debug_test").insertOne({
                test: true,
                timestamp: new Date(),
            });
            console.log(
                "Debug: Write test succeeded with ID:",
                testResult.insertedId
            );

            // Clean up test document
            await db
                .collection("_debug_test")
                .deleteOne({ _id: testResult.insertedId });
            console.log("Debug: Test document deleted");
        } catch (writeErr: any) {
            console.error("Debug: Write test failed", writeErr);
            return NextResponse.json(
                {
                    status: "error",
                    message: "MongoDB write permission test failed",
                    error: writeErr.message,
                    connectionStatus: "Connected but cannot write",
                },
                { status: 500 }
            );
        }

        // List collections to verify structure
        const collections = await db.listCollections().toArray();
        console.log(
            "Debug: Available collections:",
            collections.map((c) => c.name)
        );

        // Check if users collection exists
        const hasUsersCollection = collections.some((c) => c.name === "users");
        console.log(`Debug: Users collection exists: ${hasUsersCollection}`);

        // Count users
        const userCount = await db.collection("users").countDocuments();
        console.log(`Debug: Found ${userCount} users in the database`);

        // Get first 5 users (limited for security)
        const users = await db
            .collection("users")
            .find({})
            .limit(5)
            .project({
                _id: 1,
                email: 1,
                name: 1,
                role: 1,
                createdAt: 1,
            })
            .toArray();

        console.log("Debug: First 5 users:", users);

        return NextResponse.json({
            status: "success",
            connectionStatus: "Connected with write permission",
            collections: collections.map((c) => c.name),
            hasUsersCollection,
            userCount,
            sampleUsers: users.map((u) => ({
                id: u._id,
                email: u.email,
                name: u.name,
                role: u.role || "user",
                createdAt: u.createdAt,
            })),
        });
    } catch (error: any) {
        console.error("Debug API Error:", error);
        return NextResponse.json(
            { status: "error", message: error.message },
            { status: 500 }
        );
    }
}
