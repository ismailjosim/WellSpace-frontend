/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { registerValidationSchema } from '@/schema/authSchema'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { getDefaultDashboardRoutes, UserRole } from '@/lib/auth-utils'
import { parse } from 'cookie'
import { setCookie } from './tokenHandlers'

export const registerUser = async (
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
		// ✅ Extract form data
		const rawData = {
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
		}

		// ✅ Validate the input fields
		const validatedFields = registerValidationSchema.safeParse(rawData)

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

		// ✅ Prepare data for API in the correct format
		const registerData = {
			password: validatedFields.data.password,
			patient: {
				name: validatedFields.data.name,
				email: validatedFields.data.email,
			},
		}

		// ✅ Send to API
		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(registerData))

		const res = await fetch(
			'http://localhost:5000/api/v1/user/create-patient',
			{
				method: 'POST',
				body: newFormData,
			},
		)

		const result = await res.json()

		// ✅ Handle backend-level errors
		if (!result.success) {
			return {
				...responseTemplate,
				success: false,
				type: 'server',
				message: result.message || 'Registration failed. Please try again.',
				code: result.error?.cause || null,
			}
		}

		// ✅ Auto-login after successful registration
		const loginRes = await fetch('http://localhost:5000/api/v1/auth/login', {
			method: 'POST',
			body: JSON.stringify({
				email: validatedFields.data.email,
				password: validatedFields.data.password,
			}),
			headers: { 'Content-Type': 'application/json' },
		})

		const loginResult = await loginRes.json()

		if (!loginResult.success) {
			// Registration succeeded but login failed - inform user to login manually
			return {
				...responseTemplate,
				success: true,
				message: 'Registration successful! Please login to continue.',
				redirectTo: '/login',
			}
		}

		// ✅ Extract cookies from login response
		let accessTokenObj: any = null
		let refreshTokenObj: any = null

		const setCookieHeaders = loginRes.headers.getSetCookie()
		if (setCookieHeaders && setCookieHeaders.length > 0) {
			setCookieHeaders.forEach((cookie: string) => {
				const parsed = parse(cookie)
				if (parsed['accessToken']) accessTokenObj = parsed
				if (parsed['refreshToken']) refreshTokenObj = parsed
			})
		}

		if (!accessTokenObj?.accessToken || !refreshTokenObj?.refreshToken) {
			// Registration succeeded but couldn't set cookies
			return {
				...responseTemplate,
				success: true,
				message: 'Registration successful! Please login to continue.',
				redirectTo: '/login',
			}
		}

		// ✅ Set cookies securely
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

		// ✅ Build redirect path
		const finalRedirect = `${getDefaultDashboardRoutes(
			userRole,
		)}?registered=true`

		// ✅ Return success state
		return {
			...responseTemplate,
			success: true,
			message: 'Registration successful! Welcome aboard!',
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
					: 'Registration failed. Please try again.',
		}
	}
}
