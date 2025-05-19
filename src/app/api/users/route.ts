import { NextResponse } from "next/server";
import { UserService } from "@/lib/db/models/user";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
    try {
        // Verify the user is authenticated and is an admin
        const currentUser = await getCurrentUser();

        if (!currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const userService = await UserService.getInstance();
        const users = await userService.getAllUsers();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
