export type ResponseType = 'validation' | 'server' | 'exception' | null

export interface FieldError {
	field: string
	message: string
}

export interface ActionResponse {
	success: boolean
	type: ResponseType
	message: string
	errors: FieldError[]
	code: string | null
	redirectTo: string | null
}

export const responseTemplate = (
	overrides: Partial<ActionResponse> = {},
): ActionResponse => {
	return {
		success: false,
		type: null,
		message: '',
		errors: [],
		code: null,
		redirectTo: null,
		...overrides,
	}
}
