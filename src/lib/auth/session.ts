// Server-side authentication utilities
import { auth } from "./auth";
import type { User } from "../types";

// Helper for server components to get the current user
export async function getCurrentUser(): Promise<User | null> {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    // Ensure role is properly typed
    const userRole = ((session.user.role as string) || "user") as
        | "user"
        | "admin";

    return {
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
        role: userRole,
        image: session.user.image || null,
    };
}
