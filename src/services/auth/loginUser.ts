/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { z } from 'zod'
import { parse } from 'cookie'
import { cookies } from 'next/headers'
const loginValidationSchema = z.object({
	email: z.email({
		error: 'Invalid email address',
	}),
	password: z
		.string({
			error: 'Password is required',
		})
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password must be less than 100 characters'),
})

export const loginUser = async (
	_currentState: any,
	formData: FormData,
): Promise<any> => {
	try {
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

		// console.log('Sending login data:', validatedFields.data)

		// Send to API
		const res = await fetch('http://localhost:5000/api/v1/auth/login', {
			method: 'POST',
			body: JSON.stringify(validatedFields.data),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		const data = await res.json()

		const setCookieHeaders = res.headers.getSetCookie()
		if (setCookieHeaders) {
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
		}

		if (!accessTokenObj) {
			throw new Error('Authentication tokens are missing')
		}
		if (!refreshTokenObj) {
			throw new Error('Authentication tokens are missing')
		}

		// set cookies
		const cookieStore = await cookies()

		cookieStore.set('accessToken', accessTokenObj.accessToken, {
			secure: true,
			httpOnly: true,
			maxAge: parseInt(accessTokenObj['Max-Age']) || undefined,
			path: accessTokenObj.Path || '/',
		})
		cookieStore.set('refreshToken', refreshTokenObj.refreshToken, {
			secure: true,
			httpOnly: true,
			maxAge: parseInt(refreshTokenObj['Max-Age']) || undefined,
		})

		return data
	} catch (error) {
		return {
			success: false,
			errors: [
				{
					field: 'general',
					message:
						error instanceof Error
							? error.message
							: 'Login failed. Please try again.',
				},
			],
		}
	}
}
