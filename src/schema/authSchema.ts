import z from 'zod'

export const registerValidationSchema = z.object({
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

export const loginValidationSchema = z.object({
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

export const resetPasswordSchema = z
	.object({
		newPassword: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z
			.string()
			.min(6, 'Password must be at least 6 characters'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export const forgotPasswordZodSchema = z.object({
	email: z.email('Invalid email address'),
})

export const changePasswordZodSchema = z
	.object({
		oldPassword: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		newPassword: z
			.string()
			.min(6, 'Password must be at least 6 characters long'),
		confirmPassword: z
			.string()
			.min(6, 'Confirm Password must be at least 6 characters long'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',

		path: ['confirmPassword'],
	})
