/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from '@/lib/server-fetch'

// ======================================================
// GET ALL APPOINTMENTS
// API: GET /appointment
// ======================================================
export async function getAppointments(queryString?: string) {
	try {
		const res = await serverFetch.get(
			`/appointment${queryString ? `?${queryString}` : ''}`,
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
// GET APPOINTMENT BY ID
// API: GET /appointment/:id
// ======================================================
export async function getAppointmentById(id: string) {
	try {
		const res = await serverFetch.get(`/appointment/${id}`)
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
// CHANGE APPOINTMENT STATUS
// API: PATCH /appointment/status/:id
// ======================================================
export async function changeAppointmentStatus(id: string, status: string) {
	try {
		const response = await serverFetch.patch(`/appointment/status/${id}`, {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status }),
		})

		const result = await response.json()
		return result
	} catch (error: any) {
		console.log('Change appointment status error:', error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Failed to change appointment status.',
		}
	}
}
