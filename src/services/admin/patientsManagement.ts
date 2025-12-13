/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import { updatePatientZodSchema } from '../../schema/patient.validation'

// ======================================================
// GET ALL PATIENTS
// API: GET /patient
// ======================================================
export async function getPatients(queryString?: string) {
	try {
		const res = await serverFetch.get(
			`/patient${queryString ? `?${queryString}` : ''}`,
		)

		return await res.json()
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

// ======================================================
// GET PATIENT BY ID
// API: GET /patient/:id
// ======================================================
export async function getPatientById(id: string) {
	try {
		const res = await serverFetch.get(`/patient/${id}`)
		return await res.json()
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

// ======================================================
// UPDATE PATIENT
// API: PATCH /patient/:id
// ======================================================
export async function updatePatient(
	id: string,
	_prevState: any,
	formData: FormData,
) {
	const payload = {
		name: formData.get('name') as string,
		contactNumber: formData.get('contactNumber') as string,
		address: formData.get('address') as string,
	}

	const validation = zodValidator(payload, updatePatientZodSchema)

	if (!validation.success) return validation

	try {
		const res = await serverFetch.patch(`/patient/${id}`, {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validation.data),
		})

		return await res.json()
	} catch (error: any) {
		console.error('Update patient error:', error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Failed to update patient.',
			formData: payload,
		}
	}
}

// ======================================================
// SOFT DELETE PATIENT
// API: DELETE /patient/soft/:id
// ======================================================
export async function softDeletePatient(id: string) {
	try {
		const res = await serverFetch.delete(`/patient/${id}`)
		return await res.json()
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

// ======================================================
// HARD DELETE PATIENT
// API: DELETE /patient/:id
// ======================================================
export async function deletePatient(id: string) {
	try {
		const res = await serverFetch.delete(`/patient/${id}`)
		return await res.json()
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
