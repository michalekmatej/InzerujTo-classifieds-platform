import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import getDbClient from "@/lib/db/db";
import authConfig from "../../../auth.config";
import { Adapter } from "next-auth/adapters";
import { UserService } from "@/lib/db/models/user";

const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(getDbClient()) as Adapter,
    session: { strategy: "jwt" },
    callbacks: {
        jwt: async ({ token, user }) => {
            // If user is passed, it means this is the first sign in
            if (user) {
                // Get document ID from MongoDB, use user.id as a fallback
                const usersService = await UserService.getInstance();
                const userData = user.email ? await usersService.findByEmail(user.email) : null;
                token.id = userData && userData._id ? userData._id.toString() : user.id;
                token.role = user.role;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    ...authConfig,
});

export { auth, handlers, signIn, signOut };
