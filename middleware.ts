import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

// Augment the User type to include role
declare module "next-auth" {
    interface User {
        role?: string;
    }
}

const unauthenticatedOnlyRoutes = ["/login", "/register"];
const protectedRoutes = ["/dashboard", "/classifieds/new"];
const adminRoutes = ["/admin"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const { auth: session } = req;

    console.log(`Middleware processing path: ${pathname}, session:`, 
        session ? `User authenticated: ${!!session.user}` : "No session");

    const isUnauthenticatedRoute = unauthenticatedOnlyRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isUnauthenticatedRoute) {
        if (session?.user) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    if (isProtectedRoute) {
        if (!session?.user) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    if (isAdminRoute) {
        if (!session?.user || session?.user?.role !== "admin") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
