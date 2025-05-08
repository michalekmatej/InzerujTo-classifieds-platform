import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("classifieds");

        // Check if user already exists
        const existingUser = await db.collection("users").findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await hash(password, 12);

        const result = await db.collection("users").insertOne({
            name,
            email,
            password: hashedPassword,
            role: "user",
            createdAt: new Date(),
        });

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
