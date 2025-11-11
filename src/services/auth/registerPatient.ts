/* eslint-disable @typescript-eslint/no-explicit-any */

import { loginUser } from './loginUser'
import { registerValidationSchema } from '@/schema/authSchema'

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

		// console.log('Sending registration data:', registerData)

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

		const data = await res.json()

		// login user user after register
		if (data.success) {
			await loginUser(_currentState, formData)
		}

		return data
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
					: 'Registration Failed. Please try again.'
			}`,
		}
	}
}
