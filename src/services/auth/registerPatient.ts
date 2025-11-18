/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { registerValidationSchema } from '@/schema/authSchema'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getDefaultDashboardRoutes, UserRole } from '@/lib/auth-utils'
import { parse } from 'cookie'
import { setCookie } from './tokenHandlers'
import { serverFetch } from '../../lib/server-fetch'
import { zodValidator } from '../../lib/zodValidator'
import { responseTemplate } from '../../lib/responseTemplate'

export const registerUser = async (
	_currentState: any,
	formData: FormData,
): Promise<any> => {
	try {
		// -----------------------------
		// 🔹 1. Extract form data
		// -----------------------------
		const rawData = {
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
		}

		// -----------------------------
		// 🔹 2. Validate input
		// -----------------------------
		const validated = zodValidator(rawData, registerValidationSchema)
		if (!validated.success) return validated

		const payload = validated?.data

		// -----------------------------
		// 🔹 3. Convert to backend payload
		// -----------------------------
		const registerData = {
			password: payload?.password,
			patient: {
				name: payload?.name,
				email: payload?.email,
			},
		}

		// -----------------------------
		// 🔹 4. API request (JSON only)
		// -----------------------------
		const res = await serverFetch.post('/user/create-patient', {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(registerData),
		})

		const result = await res.json()

		if (!result.success) {
			return responseTemplate({
				success: false,
				type: 'server',
				message: result.message,
				code: result.error?.cause || null,
			})
		}

		// =============================
		// 🔥 AUTO LOGIN AFTER REGISTER
		// =============================

		const loginRes = await serverFetch.post('/auth/login', {
			body: JSON.stringify({
				email: payload?.email,
				password: payload?.password,
			}),
		})

		const loginResult = await loginRes.json()

		if (!loginResult.success) {
			return responseTemplate({
				success: true,
				message: 'Registration successful! Please log in.',
				redirectTo: '/login',
			})
		}

		// -----------------------------
		// 🔹 5. Extract cookies
		// -----------------------------
		let accessTokenObj: any = null
		let refreshTokenObj: any = null

		const setCookieHeaders = loginRes.headers.getSetCookie()
		if (setCookieHeaders) {
			setCookieHeaders.forEach((cookie: string) => {
				const parsed = parse(cookie)
				if (parsed.accessToken) accessTokenObj = parsed
				if (parsed.refreshToken) refreshTokenObj = parsed
			})
		}

		if (!accessTokenObj || !refreshTokenObj) {
			return responseTemplate({
				success: true,
				message: 'Registration successful! Please log in.',
				redirectTo: '/login',
			})
		}

		// -----------------------------
		// 🔹 6. Set cookies
		// -----------------------------
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

		// -----------------------------
		// 🔹 7. Decode token → route
		// -----------------------------
		const verified: JwtPayload | string = jwt.verify(
			accessTokenObj.accessToken,
			process.env.ACCESS_TOKEN_SECRET as string,
		)

		if (typeof verified === 'string') {
			throw new Error('Invalid token')
		}

		const userRole: UserRole = verified.role

		// -----------------------------
		// 🔹 8. Redirect based on role
		// -----------------------------
		return responseTemplate({
			success: true,
			message: 'Registration successful!',
			redirectTo: getDefaultDashboardRoutes(userRole),
		})
	} catch (error: any) {
		if (error?.digest?.startsWith('NEXT_REDIRECT')) throw error

		return responseTemplate({
			success: false,
			type: 'exception',
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Registration failed. Please try again.',
		})
	}
}
