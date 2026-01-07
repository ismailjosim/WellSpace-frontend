import { z } from 'zod'

export const createAdminZodSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Valid email is required'),
	contactNumber: z.string().min(1, 'Contact number is required'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	profilePhoto: z
		.any()
		.refine((file) => file instanceof Blob, 'Profile photo is required')
		.refine((file) => file.size > 0, 'Profile photo is required'),
})

export const updateAdminZodSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	contactNumber: z.string().min(1, 'Contact number is required'),
})
