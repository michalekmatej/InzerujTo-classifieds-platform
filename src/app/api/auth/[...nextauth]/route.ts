import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

// Extend the default session and token types
declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: string;
        };
    }

    interface User {
        id: string;
        name?: string;
        email?: string;
        image?: string | null;
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Login error: Email and password required");
                    throw new Error("Email and password required");
                }

                try {
                    const client = await clientPromise;
                    const db = client.db("classifieds");

                    console.log(
                        `Attempting to find user with email: ${credentials.email}`
                    );

                    // Use case-insensitive search with regex
                    const user = await db
                        .collection("users")
                        .findOne({
                            email: {
                                $regex: new RegExp(
                                    `^${credentials.email}$`,
                                    "i"
                                ),
                            },
                        });

                    if (!user) {
                        console.log(
                            `User not found with email: ${credentials.email}`
                        );
                        console.log("Available users in database:");

                        // List first 5 users for debugging
                        const users = await db
                            .collection("users")
                            .find({})
                            .limit(5)
                            .toArray();
                        users.forEach((u) =>
                            console.log(`- ${u.email} (ID: ${u._id})`)
                        );

                        throw new Error("User not found");
                    }

                    console.log(
                        `User found: ${user._id}, attempting password verification`
                    );

                    const isPasswordValid = await compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        console.log("Invalid password provided");
                        throw new Error("Invalid password");
                    }

                    console.log("Authentication successful");
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role || "user",
                        image: user.image || null,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    throw error;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
