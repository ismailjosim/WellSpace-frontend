/* eslint-disable @typescript-eslint/no-explicit-any */

import { responseTemplate } from './responseTemplate'

export const normalizeServerError = (result: any) => {
	const template = responseTemplate({
		type: 'server',
		message: result?.message || 'Server error. Please try again.',
	})

	// 👉 Zod validation errors (array)
	if (Array.isArray(result?.error)) {
		template.type = 'validation'
		template.errors = result.error.map((err: any) => ({
			field: err.path,
			message: err.message,
		}))
		return template
	}

	// 👉 Prisma / AppError / General errors
	if (typeof result?.error === 'object' && result?.error !== null) {
		template.code = result.error.code || result.error.cause || null
		return template
	}

	return template
}
