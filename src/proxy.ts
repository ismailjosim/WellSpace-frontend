import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
	const token = request.cookies.get('accessToken')?.value
	const pathname = request.nextUrl.pathname

	// Protected routes that require authentication
	const protectedPaths = [
		'/dashboard',
		'/profile',
		'/settings',
		'/appointments',
	]

	// Auth routes that should NOT be accessible when logged in
	const authRoutes = ['/login', '/register', '/forgot-password']

	const isProtectedPath = protectedPaths.some((path) =>
		pathname.startsWith(path),
	)
	const isAuthRoute = authRoutes.some((path) => pathname.startsWith(path))

	// ✅ Case 1: Unauthenticated trying to access protected routes
	if (isProtectedPath && !token) {
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// ✅ Case 2: Logged-in users accessing auth routes
	if (isAuthRoute && token) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	// ✅ Case 3: Allow normal flow
	return NextResponse.next()
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/profile',
		'/settings',
		'/appointments',
		'/login',
		'/register',
		'/forgot-password',
	],
}
