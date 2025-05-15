// Server-side authentication utilities
import { auth } from "./auth";
import type { User } from "../types";

// Helper for server components to get the current user
export async function getCurrentUser(): Promise<User | null> {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    return {
        id: session.user.id as string,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role as "user" | "admin",
        // image: session.user.image || null,
    };
}
