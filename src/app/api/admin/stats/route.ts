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
        const [userService, classifiedService] = await Promise.all([
            UserService.getInstance(),
            ClassifiedService.getInstance(),
        ]);

        // Fetch statistics and recent items in parallel
        const [
            userCount,
            adminCount,
            classifiedCount,
            categoriesWithCounts,
            recentClassifieds,
            recentUsers,
        ] = await Promise.all([
            userService.countUsers(),
            userService.countUsersByRole("admin"),
            classifiedService.countClassifieds({}),
            classifiedService.getCategoriesWithCounts(),
            classifiedService.getRecentClassifieds(5),
            userService.getRecentUsers(5),
        ]);

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
