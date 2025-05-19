import { NextResponse } from "next/server";
import { UserService } from "@/lib/db/models/user";
import { ClassifiedService } from "@/lib/db/models/classified";
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

        // Get services
        const userService = await UserService.getInstance();
        const classifiedService = await ClassifiedService.getInstance();

        // Get statistics
        const [userCount, adminCount, classifiedCount, categoriesWithCounts] =
            await Promise.all([
                userService.countUsers(),
                userService.countUsersByRole("admin"),
                classifiedService.countClassifieds({}),
                classifiedService.getCategoriesWithCounts(),
            ]);

        // Get recent items
        const recentClassifieds = await classifiedService.getRecentClassifieds(
            5
        );
        const recentUsers = await userService.getRecentUsers(5);

        return NextResponse.json(
            {
                stats: {
                    userCount,
                    adminCount,
                    classifiedCount,
                    categoriesWithCounts,
                },
                recent: {
                    classifieds: recentClassifieds,
                    users: recentUsers,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching admin statistics:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
