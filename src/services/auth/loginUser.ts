/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { z } from 'zod'

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
		// console.log('Login response:', data)

		return {
			success: true,
			data,
		}
	} catch (error) {
		// console.error('Login error:', error)
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
