import jwt, { JwtPayload } from "jsonwebtoken";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getDefaultDashboardRoutes,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/auth-utils";
import { deleteCookie, getCookie } from "./services/auth/tokenHandlers";
import { getUserInfo } from "./services/auth/getUserInfo";
import { getNewAccessToken } from "./services/auth/authService";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasTokenRefreshedParam =
    request.nextUrl.searchParams.has("tokenRefreshed");

  // If coming back after token refresh, remove the param and continue
  if (hasTokenRefreshedParam) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("tokenRefreshed");
    return NextResponse.redirect(url);
  }

  const tokenRefreshResult = await getNewAccessToken();

  // If token was refreshed, redirect to same page to fetch with new token
  if (tokenRefreshResult?.tokenRefreshed) {
    const url = request.nextUrl.clone();
    url.searchParams.set("tokenRefreshed", "true");
    return NextResponse.redirect(url);
  }

  const accessToken = (await getCookie("accessToken")) || null;
  let userRole: UserRole | null = null;

  if (accessToken) {
    try {
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;

      if (!verifiedToken || typeof verifiedToken === "string") {
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");
        return NextResponse.redirect(new URL("/", request.url));
      }
      userRole = verifiedToken.role as UserRole;
    } catch {
      await deleteCookie("accessToken");
      await deleteCookie("refreshToken");
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // find route owner
  const routerOwner = getRouteOwner(pathname);
  const isAuth = isAuthRoute(pathname);

  // * Rule 01: if user is logged in and trying to access auth route => redirect to dashboard
  if (accessToken && isAuth && userRole) {
    const defaultRoute = getDefaultDashboardRoutes(userRole);
    if (pathname !== defaultRoute) {
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
    return NextResponse.next();
  }

  //* Rule 2 : User is trying to access open public route
  if (routerOwner === null) {
    return NextResponse.next();
  }

  //* Rule 3 : Protected route requires authentication
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // * Rule 4: User needs password change
  if (accessToken && userRole) {
    const userInfo = await getUserInfo();
    if (userInfo?.needPasswordChange) {
      if (pathname !== "/reset-password") {
        const resetPasswordUrl = new URL("/reset-password", request.url);
        resetPasswordUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(resetPasswordUrl);
      }
      return NextResponse.next();
    }
    if (pathname === "/reset-password" && !userInfo?.needPasswordChange) {
      const defaultRoute = getDefaultDashboardRoutes(userRole);
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
  }

  //* Rule 5 : Common protected route
  if (routerOwner === "COMMON") {
    return NextResponse.next();
  }

  //* Rule 6 : Role-based protected route
  if (
    routerOwner === "ADMIN" ||
    routerOwner === "DOCTOR" ||
    routerOwner === "PATIENT"
  ) {
    const hasAccess =
      (routerOwner === "ADMIN" && (userRole === "ADMIN" || userRole === "SUPER_ADMIN")) ||
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
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
