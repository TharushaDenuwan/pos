import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@nextplate/api/lib/auth.js";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified"
];

const protectedRoutes = ["/admin", "/account"];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    // Fetch session
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || ""
        }
      }
    );

    // If Auth route and Already authenticated,
    // Redirect back
    if (authRoutes.includes(pathname) && session) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    // If protected route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    /**
     * If admin route and authenticated,
     * Check, is user role is admin,
     * If not, redirect to 404
     * If user role is admin, continue,
     */
    if (pathname.startsWith("/admin") && session) {
      if (session.user.role !== "admin") {
        return NextResponse.redirect(new URL("/404", request.url));
      }
    } else if (pathname.startsWith("/account") && session) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
