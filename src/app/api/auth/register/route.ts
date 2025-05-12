import { NextResponse } from "next/server";
import { UserService } from "@/lib/db/models/user";

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

        // Použití centralizované UserService namísto přímého přístupu k MongoDB
        console.log("Registration: Initializing UserService");
        const userService = await UserService.getInstance();

        // Vytvoření uživatele přes UserService
        console.log(`Registration: Creating user ${email}`);
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
