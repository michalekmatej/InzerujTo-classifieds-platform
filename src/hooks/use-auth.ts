"use client";

import { useSession } from "next-auth/react";
import { User } from "@/lib/types";

export function useAuth() {
    const { data: session } = useSession();

    const user: User | null = session?.user
        ? {
              id: session.user.id as string,
              name: session.user.name as string,
              email: session.user.email as string,
              role: ((session.user.role as string) || "user") as
                  | "user"
                  | "admin",
              image: session.user.image as string | null,
          }
        : null;

    return {
        user,
        isAuthenticated: !!session?.user,
        isLoading: false,
    };
}
