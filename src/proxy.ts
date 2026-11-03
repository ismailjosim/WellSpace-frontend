import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultDashboardRoutes,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET ||
  "7b9cdddfed5391cbc1d830621e7fda8be4bcee00b8264cee7203f940955544508e3a0c971d571f4acb3c81a277b496410d1b051e773dd796647658652edb65b9";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve tokens from request cookies
  const accessToken = request.cookies.get("accessToken")?.value || null;
  const refreshToken = request.cookies.get("refreshToken")?.value || null;

  let userRole: UserRole | null = null;
  let isTokenValid = false;
  let needPasswordChange = false;

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET,
      ) as JwtPayload;

      if (verifiedToken && typeof verifiedToken !== "string") {
        isTokenValid = true;
        const rawRole = (verifiedToken.role || "").toString().toUpperCase();
        userRole =
          rawRole === "SUPERADMIN" ? "SUPER_ADMIN" : (rawRole as UserRole);
        needPasswordChange = Boolean(verifiedToken.needPasswordChange);
      }
    } catch {
      isTokenValid = false;
    }
  }

  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);
  const isPublic = routerOwner === null;

  // Case A: User has invalid or missing token
  if (!isTokenValid) {
    // If accessing auth routes (login, register) or public pages, never redirect to login.
    // Allow request to proceed and wipe invalid cookies if present.
    if (isAuth || isPublic) {
      const res = NextResponse.next();
      if (accessToken || refreshToken) {
        res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
        res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
      }
      return res;
    }

    // Attempting to access protected route without valid auth -> redirect to /login
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/login") {
      loginUrl.searchParams.set("redirect", pathname);
    }
    const res = NextResponse.redirect(loginUrl);
    if (accessToken || refreshToken) {
      res.cookies.set("accessToken", "", { path: "/", maxAge: 0 });
      res.cookies.set("refreshToken", "", { path: "/", maxAge: 0 });
    }
    return res;
  }

  // Case B: User has a valid token
  // 1. If trying to access auth route (login, register), redirect to appropriate dashboard
  if (isAuth && userRole) {
    const defaultRoute = getDefaultDashboardRoutes(userRole);
    if (pathname !== defaultRoute) {
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
    return NextResponse.next();
  }

  // 2. Open public route
  if (isPublic) {
    return NextResponse.next();
  }

  // 3. Password change requirement
  if (needPasswordChange) {
    if (pathname !== "/reset-password") {
      const resetPasswordUrl = new URL("/reset-password", request.url);
      resetPasswordUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(resetPasswordUrl);
    }
    return NextResponse.next();
  }
  if (pathname === "/reset-password" && !needPasswordChange && userRole) {
    const defaultRoute = getDefaultDashboardRoutes(userRole);
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // 4. Common protected route
  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  // 5. Role-based protected routes
  if (
    routerOwner === "ADMIN" ||
    routerOwner === "DOCTOR" ||
    routerOwner === "PATIENT"
  ) {
    const hasAccess =
      (routerOwner === "ADMIN" &&
        (userRole === "ADMIN" || userRole === "SUPER_ADMIN")) ||
      userRole === routerOwner;

    if (!hasAccess && userRole) {
      const defaultRoute = getDefaultDashboardRoutes(userRole);
      if (pathname !== defaultRoute) {
        return NextResponse.redirect(new URL(defaultRoute, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
