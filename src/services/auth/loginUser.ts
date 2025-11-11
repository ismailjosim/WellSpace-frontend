'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { parse } from 'cookie'
import { setCookie } from './tokenHandlers'
import { redirect } from 'next/navigation'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
	getDefaultDashboardRoutes,
	isValidRedirectForRole,
	UserRole,
} from '@/lib/auth-utils'
import { loginValidationSchema } from '@/schema/authSchema'

export const loginUser = async (
	_currentState: any,
	formData: FormData,
): Promise<any> => {
	try {
		const redirectTo = formData.get('redirect') || null

		let accessTokenObj: null | any = null
		let refreshTokenObj: null | any = null
		// Extract form data
		const rawData = {
			email: formData.get('email'),
			password: formData.get('password'),
		}

		// Validate the input fields
		const validatedFields = loginValidationSchema.safeParse(rawData)

		if (!validatedFields.success) {
			return {
				success: false,
				errors: validatedFields.error.issues.map((issue) => {
					return {
						field: issue.path[0],
						message: issue.message,
					}
				}),
			}
		}

		// Send to API
		const res = await fetch('http://localhost:5000/api/v1/auth/login', {
			method: 'POST',
			body: JSON.stringify(rawData),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		const result = await res.json()

		const setCookieHeaders = res.headers.getSetCookie()
		if (setCookieHeaders && setCookieHeaders.length > 0) {
			setCookieHeaders.forEach((cookie: string) => {
				const parsedCookie = parse(cookie)
				if (parsedCookie['accessToken']) {
					// Handle access token cookie
					accessTokenObj = parsedCookie
				}
				if (parsedCookie['refreshToken']) {
					// Handle refresh token cookie
					refreshTokenObj = parsedCookie
				}
			})
		} else {
			throw new Error('No Set-Cookie header found')
		}

		if (!accessTokenObj) {
			throw new Error('Authentication tokens are missing')
		}
		if (!refreshTokenObj) {
			throw new Error('Authentication tokens are missing')
		}

		// set cookies

		await setCookie('accessToken', accessTokenObj.accessToken, {
			secure: true,
			httpOnly: true,
			maxAge: parseInt(accessTokenObj['Max-Age']) || undefined,
			path: accessTokenObj.Path || '/',
			sameSite: accessTokenObj['SameSite'] || 'none',
		})

		await setCookie('refreshToken', refreshTokenObj.refreshToken, {
			secure: true,
			httpOnly: true,
			maxAge: parseInt(refreshTokenObj['Max-Age']) || undefined,
			sameSite: accessTokenObj['SameSite'] || 'none',
		})

		const verifiedToken: JwtPayload | string = jwt.verify(
			accessTokenObj.accessToken,
			process.env.JWT_SECRET as string,
		)

		if (typeof verifiedToken === 'string') {
			throw new Error('Invalid token')
		}

		const userRole: UserRole = verifiedToken.role

		if (!result.success) {
			throw new Error(result.message || 'Login failed')
		}
		if (redirectTo) {
			const requestedPath = redirectTo.toString()
			if (isValidRedirectForRole(requestedPath, userRole)) {
				redirect(`${requestedPath}?loggedIn=true`)
			} else {
				redirect(`${getDefaultDashboardRoutes(userRole)}?loggedIn=true`)
			}
		} else {
			redirect(`${getDefaultDashboardRoutes(userRole)}?loggedIn=true`)
		}
	} catch (error: any) {
		if (error?.digest?.startsWith('NEXT_REDIRECT')) {
			throw error
		}
		console.log(error)
		return {
			success: false,
			message: `${
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Login Failed. You might have entered incorrect email or password.'
			}`,
		}
	}
}
