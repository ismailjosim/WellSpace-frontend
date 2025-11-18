import { ZodObject } from 'zod'

export const zodValidator = <T>(payload: T, schema: ZodObject) => {
	const validatePayload = schema.safeParse(payload)

	if (!validatePayload.success) {
		return {
			success: false,
			type: 'validation' as const,
			message: 'Validation failed',
			errors: validatePayload.error.issues.map((issue) => ({
				field: issue.path[0] as string,
				message: issue.message,
			})),
		}
	}

	return {
		success: true,
		data: validatePayload.data,
	}
}
