// Define route configurations for different user roles
// exact: ["/my-profile",'settings']
// patterns:["/^|/dashboard/","route sharing with /dashboard/* /dashboard/analytics, /dashboard/settings/profile"]

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'PATIENT'

export type RouteConfig = {
	exact: string[]
	patterns: RegExp[]
}

export const authRoutes = [
	'/login',
	'/register',
	'/forgot-password',
	'/reset-password',
]

export const commonProtectedRoutes: RouteConfig = {
	exact: ['/my-profile', 'settings', 'change-password'],
	patterns: [],
}

export const doctorProtectedRoutes: RouteConfig = {
	exact: [], // exact match routes for example: '/assistants'
	patterns: [/^\/doctor/],
}

export const adminProtectedRoutes: RouteConfig = {
	exact: [],
	patterns: [/^\/admin/],
}
export const patientProtectedRoutes: RouteConfig = {
	exact: [],
	patterns: [/^\/dashboard/],
}

export const isAuthRoute = (path: string) => {
	return authRoutes.some((route) => path.startsWith(route)) //* Use startsWith for prefix matching for example /login, /login/step2
}

export const isRouteMatches = (path: string, routes: RouteConfig): boolean => {
	//* Check exact matches then it will return the true
	if (routes.exact.includes(path)) {
		return true
	}

	// * Check pattern matches
	return routes.patterns.some((pattern: RegExp) => pattern.test(path))
	//* example if the path === /dashboard/my-appointments => matches /^\/dashboard/ => true
}
export const getRouteOwner = (
	path: string,
): 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'COMMON' | null => {
	if (isRouteMatches(path, doctorProtectedRoutes)) {
		return 'DOCTOR'
	}
	if (isRouteMatches(path, adminProtectedRoutes)) {
		return 'ADMIN'
	}
	if (isRouteMatches(path, patientProtectedRoutes)) {
		return 'PATIENT'
	}

	if (isRouteMatches(path, commonProtectedRoutes)) {
		return 'COMMON'
	}
	return null
}
export const getDefaultDashboardRoutes = (role: UserRole) => {
	switch (role) {
		case 'SUPER_ADMIN':
			return '/admin/dashboard'
		case 'ADMIN':
			return '/admin/dashboard'
		case 'DOCTOR':
			return '/doctor/dashboard'
		case 'PATIENT':
			return '/dashboard'
		default:
			return '/'
	}
}
export const isValidRedirectForRole = (
	redirectPath: string,
	role: UserRole,
): boolean => {
	const routeOwner = getRouteOwner(redirectPath)

	if (routeOwner === null || routeOwner === 'COMMON') {
		return true
	}

	if (routeOwner === role) {
		return true
	}

	return false
}
