import { NextResponse } from "next/server";

export async function POST() {
    try {
        return NextResponse.json({
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json(
            { message: "An error occurred during logout" },
            { status: 500 }
        );
    }
}
