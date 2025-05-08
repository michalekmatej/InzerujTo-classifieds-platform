import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        console.log("Registration: Starting registration process");
        const { email, password, name } = await req.json();
        console.log(
            `Registration: Received request for email: ${email}, name: ${name}`
        );

        if (!email || !password || !name) {
            console.log("Registration: Missing required fields");
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        console.log("Registration: Connecting to MongoDB");
        const client = await clientPromise;
        console.log("Registration: MongoDB connection established");

        const db = client.db("classifieds");
        console.log("Registration: Using classifieds database");

        // Check if user already exists
        console.log(`Registration: Checking if user ${email} already exists`);
        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            console.log(`Registration: User ${email} already exists`);
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        console.log("Registration: Hashing password");
        const hashedPassword = await hash(password, 12);

        console.log("Registration: Attempting to insert user into database");
        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            role: "user",
            createdAt: new Date(),
        });

        console.log(
            `Registration: Insert operation completed with ID: ${result.insertedId}`
        );

        // Verify the user was actually inserted
        console.log("Registration: Verifying user was inserted");
        const verifyUser = await db
            .collection("users")
            .findOne({ _id: result.insertedId });

        if (verifyUser) {
            console.log(
                `Registration: Verification successful, user ${email} exists in database`
            );
        } else {
            console.log(
                `Registration: VERIFICATION FAILED - User ${email} not found after insert`
            );
        }

        return NextResponse.json(
            {
                message: "User created successfully",
                userId: result.insertedId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
