/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { serverFetch } from '@/lib/server-fetch'
import { zodValidator } from '@/lib/zodValidator'
import { createScheduleZodSchema } from '../../schema/schedule.validation'

// ======================================================
// CREATE SCHEDULE
// API: POST /schedule
// ======================================================
export async function createSchedule(_prevState: any, formData: FormData) {
	const payload = {
		startDate: formData.get('startDate') as string,
		endDate: formData.get('endDate') as string,
		startTime: formData.get('startTime') as string,
		endTime: formData.get('endTime') as string,
	}

	const validation = zodValidator(payload, createScheduleZodSchema)

	if (!validation.success) return validation

	try {
		const res = await serverFetch.post('/schedule', {
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(validation.data),
		})

		return await res.json()
	} catch (error: any) {
		console.error('Create schedule error:', error)
		return {
			success: false,
			message:
				process.env.NODE_ENV === 'development'
					? error.message
					: 'Failed to create schedule.',
			formData: payload,
		}
	}
}

// ======================================================
// GET ALL SCHEDULES
// API: GET /schedule
// ======================================================
export async function getSchedules(queryString?: string) {
	try {
		const res = await serverFetch.get(
			`/schedule${queryString ? `?${queryString}` : ''}`,
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
// GET SCHEDULE BY ID
// API: GET /schedule/:id
// ======================================================
export async function getScheduleById(id: string) {
	try {
		const res = await serverFetch.get(`/schedule/${id}`)
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
// DELETE SCHEDULE
// API: DELETE /schedule/:id
// ======================================================
export async function deleteSchedule(id: string) {
	try {
		const res = await serverFetch.delete(`/schedule/${id}`)
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
