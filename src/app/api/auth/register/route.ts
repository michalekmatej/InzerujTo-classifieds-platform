import { NextResponse } from "next/server";
import { UserService } from "@/lib/db/models/user";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();
        if (!email || !password || !name) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const userService = await UserService.getInstance();
        const result = await userService.createUser({
            name,
            email,
            password,
            role: "user",
        });

        if (!result.success) {
            console.log(`Registration failed: ${result.error}`);
            return NextResponse.json(
                { message: result.error },
                { status: 400 }
            );
        }

        console.log(
            `Registration: User created successfully with ID: ${result.user?.id}`
        );

        return NextResponse.json(
            {
                message: "User created successfully",
                userId: result.user?.id,
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
