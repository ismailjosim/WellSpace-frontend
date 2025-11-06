/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from 'zod'

const registerValidationSchema = z.object({
	name: z
		.string({
			error: 'Name is required',
		})
		.min(1, 'Name is required'),
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

export const registerUser = async (
	_currentState: any,
	formData: FormData,
): Promise<any> => {
	try {
		// Extract form data
		const rawData = {
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
		}

		// Validate the input fields
		const validatedFields = registerValidationSchema.safeParse(rawData)

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

		// Prepare data for API in the correct format
		const registerData = {
			password: validatedFields.data.password,
			patient: {
				name: validatedFields.data.name,
				email: validatedFields.data.email,
			},
		}

		console.log('Sending registration data:', registerData)

		// Send to API
		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(registerData))

		const res = await fetch(
			'http://localhost:5000/api/v1/user/create-patient',
			{
				method: 'POST',
				body: newFormData,
			},
		)

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`)
		}

		const data = await res.json()
		console.log('Registration response:', data)

		return {
			success: true,
			data,
		}
	} catch (error) {
		console.error('Registration error:', error)
		return {
			success: false,
			errors: [
				{
					field: 'general',
					message:
						error instanceof Error
							? error.message
							: 'Registration failed. Please try again.',
				},
			],
		}
	}
}
