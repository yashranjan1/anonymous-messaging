import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET, cookieName: "__Secure-authjs.session-token" });
    const url = new URL(request.nextUrl);

    if (token && 
        (
            url.pathname === "/sign-in" || 
            url.pathname === "/sign-up" || 
            url.pathname === "/verify" || 
            url.pathname === "/"
        )
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
 
    if (!token && url.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/sign-in",
        "/sign-up",
        "/",
        "/verify/:path*",
        "/dashboard/:path*",
    ],
};

