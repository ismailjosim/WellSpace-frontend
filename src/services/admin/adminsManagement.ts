/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import {
	createAdminZodSchema,
	updateAdminZodSchema,
} from '@/schema/admin.validation'

// ======================================================
//* CREATE ADMIN
// ======================================================
export async function createAdmin(_prevState: any, formData: FormData) {
	try {
		const payload = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			contactNumber: formData.get('contactNumber') as string,
			password: formData.get('password') as string,
			profilePhoto: formData.get('file') as File,
		}

		const validation = zodValidator(payload, createAdminZodSchema)

		if (!validation.success) return validation

		const validatedPayload = validation?.data

		const finalPayload = {
			password: validatedPayload.password,
			admin: {
				name: validatedPayload.name,
				email: validatedPayload.email,
				contactNumber: validatedPayload.contactNumber,
				password: validatedPayload.password,
			},
		}

		const newFormData = new FormData()
		newFormData.append('data', JSON.stringify(finalPayload))

		if (formData.get('file')) {
			newFormData.append('file', formData.get('file') as Blob)
		}

		const res = await serverFetch.post('/user/create-admin', {
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
					: 'Failed to create admin. Please try again.',
		}
	}
}

// ======================================================
// GET ALL ADMINS
// ======================================================
export async function getAdmins(queryString?: string) {
	try {
		const res = await serverFetch.get(
			`/admin${queryString ? `?${queryString}` : ''}`,
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
// GET ADMIN BY ID
// ======================================================
export async function getAdminById(id: string) {
	try {
		const res = await serverFetch.get(`/admin/${id}`)
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
// UPDATE ADMIN
// ======================================================
export async function updateAdmin(
	id: string,
	_prevState: any,
	formData: FormData,
) {
	try {
		const payload = {
			name: formData.get('name') as string,
			contactNumber: formData.get('contactNumber') as string,
		}

		const validation = zodValidator(payload, updateAdminZodSchema)

		if (!validation.success) return validation

		const res = await serverFetch.patch(`/admin/${id}`, {
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
					: 'Failed to update admin. Please try again.',
		}
	}
}

// ======================================================
// SOFT DELETE ADMIN
// ======================================================
export async function softDeleteAdmin(id: string) {
	try {
		const res = await serverFetch.delete(`/admin/soft/${id}`)
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
// HARD DELETE ADMIN
// ======================================================
export async function deleteAdmin(id: string) {
	try {
		const res = await serverFetch.delete(`/admin/${id}`)
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
