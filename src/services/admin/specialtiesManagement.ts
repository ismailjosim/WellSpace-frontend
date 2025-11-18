import z from 'zod'
import { serverFetch } from '../../lib/server-fetch'
import { zodValidator } from '../../lib/zodValidator'

/* eslint-disable @typescript-eslint/no-explicit-any */
const createSpecialtyValidationSchema = z.object({
	title: z.string().min(3, 'title must be at least 3 characters long'),
})

export async function createSpecialty(_prevState: any, formData: FormData) {
	try {
		const payload = {
			title: formData.get('title') as string,
		}

		if (
			zodValidator(payload, createSpecialtyValidationSchema).success === false
		) {
			return zodValidator(payload, createSpecialtyValidationSchema)
		}

		const validatePayload = zodValidator(
			payload,
			createSpecialtyValidationSchema,
		)

		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(validatePayload))

		if (formData.get('file')) {
			newFormData.append('file', formData.get('file') as Blob)
		}

		const res = await serverFetch.post('/specialties', {
			body: newFormData,
		})
		const result = await res.json()
		return result
	} catch (error: any) {
		console.log(error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Failed to create Specialty. Please try again.',
		}
	}
}

export async function getSpecialties() {
	try {
		const res = await serverFetch.get('/specialties')
		const result = await res.json()
		return result
	} catch (error: any) {
		console.log(error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Something went wrong!',
		}
	}
}

export async function deleteSpecialty(id: string) {
	try {
		const res = await serverFetch.delete(`/specialties/${id}`)
		const result = await res.json()
		return result
	} catch (error: any) {
		console.log(error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Something went wrong!',
		}
	}
}
