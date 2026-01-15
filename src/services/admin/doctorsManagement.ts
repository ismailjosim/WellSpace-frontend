/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import { IDoctor } from '@/types/doctor.interface'
import {
	createDoctorZodSchema,
	updateDoctorZodSchema,
} from '@/schema/doctors.validation'

// ======================================================
//* CREATE DOCTOR
// ======================================================
export async function createDoctor(_prevState: any, formData: FormData) {
	try {
		const specialtiesString = formData.get('specialties') as string
		const specialties: string[] = []

		if (specialtiesString) {
			try {
				const parsed = JSON.parse(specialtiesString)
				if (Array.isArray(parsed) && parsed.length > 0) {
					specialties.push(...parsed)
				}
			} catch {
				// Ignore invalid JSON
			}
		}

		const payload: IDoctor = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			contactNumber: formData.get('contactNumber') as string,
			address: formData.get('address') as string,
			registrationNumber: formData.get('registrationNumber') as string,
			experience: Number(formData.get('experience')),
			gender: formData.get('gender') as 'MALE' | 'FEMALE',
			appointmentFee: Number(formData.get('appointmentFee')),
			qualification: formData.get('qualification') as string,
			currentWorkingPlace: formData.get('currentWorkingPlace') as string,
			designation: formData.get('designation') as string,
			password: formData.get('password') as string,
			specialties: specialties,
		}

		const validation = zodValidator(payload, createDoctorZodSchema)

		if (!validation.success) return validation

		const validatedPayload = validation?.data

		const finalPayload = {
			password: validatedPayload.password,
			doctor: {
				name: validatedPayload.name,
				email: validatedPayload.email,
				contactNumber: validatedPayload.contactNumber,
				address: validatedPayload.address,
				registrationNumber: validatedPayload.registrationNumber,
				experience: validatedPayload.experience,
				gender: validatedPayload.gender,
				appointmentFee: validatedPayload.appointmentFee,
				qualification: validatedPayload.qualification,
				currentWorkingPlace: validatedPayload.currentWorkingPlace,
				designation: validatedPayload.designation,
				specialties: validatedPayload.specialties,
			},
		}

		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(finalPayload))

		if (formData.get('file')) {
			newFormData.append('file', formData.get('file') as Blob)
		}

		const res = await serverFetch.post('/user/create-doctor', {
			body: newFormData,
		})

		return await res.json()
	} catch (error: any) {
		console.log(error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Failed to create doctor. Please try again.',
		}
	}
}

// ======================================================
// GET ALL DOCTORS
// ======================================================
export async function getDoctors(queryString?: string): Promise<any> {
	try {
		const res = await serverFetch.get(
			`/doctor${queryString ? `?${queryString}` : ''}`,
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
// GET DOCTOR BY ID
// ======================================================
export async function getDoctorById(id: string): Promise<any> {
	try {
		const res = await serverFetch.get(`/doctor/${id}`)

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
// UPDATE DOCTOR
// ======================================================
export async function updateDoctor(
	id: string,
	_prevState: any,
	formData: FormData,
) {
	try {
		const payload: Partial<IDoctor> = {
			name: formData.get('name') as string,
			contactNumber: formData.get('contactNumber') as string,
			address: formData.get('address') as string,
			registrationNumber: formData.get('registrationNumber') as string,
			experience: Number(formData.get('experience')),
			gender: formData.get('gender') as 'MALE' | 'FEMALE',
			appointmentFee: Number(formData.get('appointmentFee')),
			qualification: formData.get('qualification') as string,
			currentWorkingPlace: formData.get('currentWorkingPlace') as string,
			designation: formData.get('designation') as string,
		}

		// Parse specialties array (for adding new specialties)
		const specialtiesValue = formData.get('specialties') as string
		if (specialtiesValue) {
			try {
				const parsed = JSON.parse(specialtiesValue)
				if (Array.isArray(parsed) && parsed.length > 0) {
					payload.specialties = parsed
				}
			} catch {
				// Ignore invalid JSON
			}
		}

		// Parse removeSpecialties array (for removing existing specialties)
		const removeSpecialtiesValue = formData.get('removeSpecialties') as string
		if (removeSpecialtiesValue) {
			try {
				const parsed = JSON.parse(removeSpecialtiesValue)
				if (Array.isArray(parsed) && parsed.length > 0) {
					payload.removeSpecialties = parsed
				}
			} catch {
				// Ignore invalid JSON
			}
		}

		const validation = zodValidator(payload, updateDoctorZodSchema)

		if (!validation.success) return validation

		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(validation.data))

		if (formData.get('file')) {
			newFormData.append('file', formData.get('file') as Blob)
		}

		const res = await serverFetch.patch(`/doctor/${id}`, {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validation.data),
		})

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
// SOFT DELETE DOCTOR
// ======================================================
export async function softDeleteDoctor(id: string) {
	try {
		const res = await serverFetch.delete(`/doctor/${id}`)
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
// HARD DELETE DOCTOR
// ======================================================
export async function deleteDoctor(id: string) {
	try {
		const res = await serverFetch.delete(`/doctor/${id}`)
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
