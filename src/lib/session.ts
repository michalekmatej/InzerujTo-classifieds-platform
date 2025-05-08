import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { User } from "./types";

// Use this function in server components to get the current session
export async function getSession() {
    return await getServerSession(authOptions);
}

// Helper for server components to get the current user
export async function getCurrentUser(): Promise<User | null> {
    const session = await getSession();

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
