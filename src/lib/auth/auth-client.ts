"use client";

import { signIn, signOut } from "next-auth/react";

export const login = async (
    email: string,
    password: string,
    redirectTo?: string
) => {
    await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: redirectTo || "/dashboard",
    });
};

export const logout = async () => {
    await signOut({ redirect: true, redirectTo: "/" });
};
