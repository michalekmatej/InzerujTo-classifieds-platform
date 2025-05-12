import { UserService } from "@/lib/db/models/user";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials, req) => {
                const result = await (
                    await UserService.getInstance()
                ).validateCredentials(
                    credentials?.email as string,
                    credentials?.password as string
                );
                if (result.success) {
                    const user = result.user;
                    if (!user) throw new Error("User not found");
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
} satisfies NextAuthConfig;
