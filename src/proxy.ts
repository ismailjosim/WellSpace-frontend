import jwt, { JwtPayload } from 'jsonwebtoken'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
	getDefaultDashboardRoutes,
	getRouteOwner,
	isAuthRoute,
	UserRole,
} from './lib/auth-utils'
import { deleteCookie, getCookie } from './services/auth/tokenHandlers'
import { getUserInfo } from './services/auth/getUserInfo'

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl
	const accessToken = (await getCookie('accessToken')) || null
	let userRole: UserRole | null = null

	if (accessToken) {
		const verifiedToken: JwtPayload | string = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET as string,
		)
		if (typeof verifiedToken === 'string') {
			await deleteCookie('accessToken')
			await deleteCookie('refreshToken')
			return NextResponse.redirect(new URL('/', request.url))
		}
		userRole = verifiedToken.role
	}

	// find route owner
	const routerOwner = getRouteOwner(pathname)
	// path = /doctor/appointments => routeOwner = DOCTOR
	// path = /my-profile => routeOwner = COMMON
	// path - /login => routeOwner = null

	// if routeOwner is null => public route => allow
	const isAuth = isAuthRoute(pathname)

	// * Rule 01: if user is logged in and trying to access auth route => redirect to dashboard
	if (accessToken && isAuth) {
		return NextResponse.redirect(
			new URL(getDefaultDashboardRoutes(userRole as UserRole), request.url),
		)
	}
	//* Rule 2 : User is trying to access open public route
	if (routerOwner === null) {
		return NextResponse.next()
	}

	//* Rule 1 & 2 for open public routes and auth routes

	if (!accessToken) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}
	// * rule 3: user need password change
	if (accessToken) {
		const userInfo = await getUserInfo()
		if (userInfo?.needPasswordChange) {
			// check user into the reset password route
			if (pathname !== '/reset-password') {
				const resetPasswordUrl = new URL('/reset-password', request.url)
				resetPasswordUrl.searchParams.set('redirect', pathname)
				return NextResponse.redirect(resetPasswordUrl)
			}
			return NextResponse.next()
		}
		// if user is in reset password route and doesn't need password change, redirect to default dashboard
		if (pathname === '/reset-password' && !userInfo?.needPasswordChange) {
			return NextResponse.redirect(
				new URL(getDefaultDashboardRoutes(userRole as UserRole), request.url),
			)
		}
	}
	//* Rule 4 : User is trying to access common protected route
	if (routerOwner === 'COMMON') {
		return NextResponse.next()
	}

	//* Rule 5 : User is trying to access role based protected route
	if (
		routerOwner === 'ADMIN' ||
		routerOwner === 'DOCTOR' ||
		routerOwner === 'PATIENT'
	) {
		if (userRole !== routerOwner) {
			return NextResponse.redirect(
				new URL(getDefaultDashboardRoutes(userRole as UserRole), request.url),
			)
		}
	}
	return NextResponse.next()
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
		'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
	],
}
