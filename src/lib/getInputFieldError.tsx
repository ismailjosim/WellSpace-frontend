/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldDescription } from '@/components/ui/field'

export interface IInputErrorState {
	errors?: { field: string; message: string }[]
}

const getInputFieldError = (
	fieldName: string,
	state: IInputErrorState | null,
) => {
	if (state?.errors?.length) {
		const error = state.errors.find((err: any) => err.field === fieldName)

		if (error?.message) {
			return (
				<FieldDescription className='text-red-500'>
					{error.message}
				</FieldDescription>
			)
		}
	}

	return null
}

export default getInputFieldError
