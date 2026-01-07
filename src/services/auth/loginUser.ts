/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { parse } from 'cookie'
import { setCookie } from './tokenHandlers'
import jwt, { JwtPayload } from 'jsonwebtoken'
import {
	getDefaultDashboardRoutes,
	isValidRedirectForRole,
	UserRole,
} from '@/lib/auth-utils'
import { loginValidationSchema } from '@/schema/authSchema'
import { serverFetch } from '@/lib/server-fetch'
import { redirect } from 'next/navigation'

export const loginUser = async (
	_currentState: any,
	formData: FormData,
): Promise<any> => {
	const responseTemplate = {
		success: false,
		type: null as 'validation' | 'server' | 'exception' | null,
		message: '',
		errors: [] as { field: string; message: string }[],
		code: null as string | null,
		redirectTo: null as string | null,
	}

	try {
		const redirectTo = formData.get('redirect') || null

		let accessTokenObj: any = null
		let refreshTokenObj: any = null

		// ✅ Extract and validate form data
		const rawData = {
			email: formData.get('email'),
			password: formData.get('password'),
		}

		const validatedFields = loginValidationSchema.safeParse(rawData)
		if (!validatedFields.success) {
			return {
				...responseTemplate,
				success: false,
				type: 'validation',
				errors: validatedFields.error.issues.map((issue) => ({
					field: issue.path[0],
					message: issue.message,
				})),
			}
		}

		// ✅ Send to backend API
		const res = await serverFetch.post('/auth/login', {
			body: JSON.stringify(rawData),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		const result = await res.json()

		// ✅ Handle backend-level errors
		if (!result.success) {
			return {
				...responseTemplate,
				success: false,
				type: 'server',
				message: result.message || 'Login failed. Please try again.',
				code: result.error?.cause || null,
			}
		}

		// ✅ Extract cookies from backend response
		const setCookieHeaders = res.headers.getSetCookie()
		if (setCookieHeaders && setCookieHeaders.length > 0) {
			setCookieHeaders.forEach((cookie: string) => {
				const parsed = parse(cookie)
				if (parsed['accessToken']) accessTokenObj = parsed
				if (parsed['refreshToken']) refreshTokenObj = parsed
			})
		} else {
			throw new Error('No Set-Cookie header found')
		}

		if (!accessTokenObj?.accessToken || !refreshTokenObj?.refreshToken) {
			throw new Error('Authentication tokens are missing')
		}

		// ✅ Set cookies securely in Next.js
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
			sameSite: refreshTokenObj['SameSite'] || 'none',
		})

		// ✅ Decode access token to determine user role
		const verifiedToken: JwtPayload | string = jwt.verify(
			accessTokenObj.accessToken,
			process.env.ACCESS_TOKEN_SECRET as string,
		)

		if (typeof verifiedToken === 'string') {
			throw new Error('Invalid token')
		}

		const userRole: UserRole = verifiedToken.role

		// console.log(result.data.user)

		if (redirectTo && result.data.user?.needPasswordChange) {
			const requestedPath = redirectTo.toString()
			console.log(requestedPath)
			if (isValidRedirectForRole(requestedPath, userRole)) {
				redirect(`/reset-password?redirect=${requestedPath}`)
			} else {
				redirect('/reset-password')
			}
		}

		// redirect to the reset-password page if the user is required to change password
		if (result.data.user?.needPasswordChange) {
			redirect('/reset-password')
		}

		// ✅ Build redirect path
		let finalRedirect = ''
		if (redirectTo) {
			const requestedPath = redirectTo.toString()
			if (isValidRedirectForRole(requestedPath, userRole)) {
				finalRedirect = `${requestedPath}?loggedIn=true`
			} else {
				finalRedirect = `${getDefaultDashboardRoutes(userRole)}?loggedIn=true`
			}
		} else {
			finalRedirect = `${getDefaultDashboardRoutes(userRole)}?loggedIn=true`
		}

		// ✅ Return success state for client toast + redirect
		return {
			...responseTemplate,
			success: true,
			message: 'Login successful!',
			redirectTo: finalRedirect,
		}
	} catch (error: any) {
		// ✅ Handle NEXT_REDIRECT (internal redirect mechanism)
		if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error

		return {
			...responseTemplate,
			success: false,
			type: 'exception',
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Something went wrong. Please try again.',
		}
	}
}
