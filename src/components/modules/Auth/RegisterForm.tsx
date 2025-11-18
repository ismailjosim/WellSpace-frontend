'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { registerUser } from '@/services/auth/registerPatient'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { toast } from 'sonner'
import getInputFieldError from '../../../lib/getInputFieldError'

const RegisterForm = () => {
	const [state, formAction, isPending] = useActionState(registerUser, null)
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()

	// ✅ Handle toast + redirect logic
	useEffect(() => {
		if (!state) return

		if (state.success) {
			toast.success(state.message || 'Registration successful!')
			if (state.redirectTo) {
				router.push(state.redirectTo)
			}
		} else if (state.message && !state.success) {
			toast.error(state.message)
		}
	}, [state, router])

	return (
		<form action={formAction}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor='name'>Full Name</FieldLabel>
					<Input
						id='name'
						name='name'
						type='text'
						placeholder='John Doe'
						required
					/>
					{getInputFieldError('name', state)}
				</Field>

				<Field>
					<FieldLabel htmlFor='email'>Email Address</FieldLabel>
					<Input
						name='email'
						type='email'
						placeholder='your@email.com'
						required
					/>
					{getInputFieldError('email', state)}
				</Field>

				<Field>
					<FieldLabel htmlFor='password'>Password</FieldLabel>
					<div className='relative'>
						<Input
							name='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
							required
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? (
								<EyeOff className='h-5 w-5' />
							) : (
								<Eye className='h-5 w-5' />
							)}
						</button>
					</div>
					{getInputFieldError('password', state)}
				</Field>

				<Field>
					<Button type='submit' className='w-full' disabled={isPending}>
						{isPending ? 'Creating Account...' : 'Create Account'}
						<UserPlus className='w-4 h-4 ml-2' />
					</Button>
					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<Separator className='flex-1' />
						<span className='text-sm font-medium text-muted-foreground'>
							OR
						</span>
						<Separator className='flex-1' />
					</div>
					<Button variant='outline' type='button' className='w-full'>
						Sign up with Google
					</Button>
					<FieldDescription className='text-center'>
						Already have an account?{' '}
						<Link href='/login' className='underline-offset-4 hover:underline'>
							Login
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	)
}

export default RegisterForm
