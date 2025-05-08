import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define protected routes
    const protectedRoutes = [
        "/dashboard",
        "/classifieds/new",
        "/favorites",
        "/admin",
    ];

    // Define admin-only routes
    const adminRoutes = ["/admin"];

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // Redirect to login if no token exists
        if (!token) {
            const url = new URL(`/login`, request.url);
            url.searchParams.set("callbackUrl", encodeURI(request.url));
            return NextResponse.redirect(url);
        }

        // Redirect non-admin users trying to access admin routes
        if (isAdminRoute && token.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}
