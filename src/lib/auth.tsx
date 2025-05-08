"use client";

import React, { createContext, useContext } from "react";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { User } from "./types";

interface AuthContextType {
    user: User | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    status: "loading" | "authenticated" | "unauthenticated";
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => {},
    signOut: async () => {},
    status: "unauthenticated",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}

export const useAuth = () => {
    const { data: session, status } = useSession();

    const user = session?.user
        ? {
              id: session.user.id as string,
              name: session.user.name || "",
              email: session.user.email || "",
              role: (session.user.role as string) || "user",
              image: session.user.image || null,
          }
        : null;

    const handleSignIn = async () => {
        await signIn("credentials");
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return {
        user,
        signIn: handleSignIn,
        signOut: handleSignOut,
        status,
    };
};

// Remove the problematic getCurrentUser function that attempts to import from session.ts
// For server components, import getCurrentUser directly from session.ts instead
