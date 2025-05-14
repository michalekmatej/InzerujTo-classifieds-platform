import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import getMongoClient from "@/lib/db/db";
import authConfig from "../../../auth.config";
import { Adapter } from "next-auth/adapters";

const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(getMongoClient()) as Adapter,
    session: { strategy: "jwt" },
    // callbacks: {
    //     jwt: async ({ token, user }) => {
    //         // If user is passed, it means this is the first sign in
    //         if (user) {
    //             token.id = user.id;
    //             token.role = user.role;
    //         }
    //         return token;
    //     },
    //     session: async ({ session, token }) => {
    //         if (token && session.user) {
    //             session.user.id = token.id as string;
    //             session.user.role = token.role as string;
    //         }
    //         return session;
    //     }
    // },
    ...authConfig,
});

export { auth, handlers };
