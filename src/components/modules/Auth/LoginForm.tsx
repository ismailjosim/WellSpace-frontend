/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useActionState, useState } from 'react'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginUser } from '@/services/auth/loginUser'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

export function LoginForm({ className }: React.ComponentProps<'div'>) {
	const [state, formAction, isPending] = useActionState(loginUser, null)
	const [showPassword, setShowPassword] = useState(false)

	const getFieldError = (fieldName: string) => {
		if (state && state.errors) {
			const error = state.errors.find((err: any) => err.field === fieldName)
			return error?.message || null
		}
		return null
	}

	return (
		<form action={formAction}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor='email'>Email Address</FieldLabel>
					<Input
						id='email'
						name='email'
						type='email'
						placeholder='your@email.com'
						required
					/>
					{getFieldError('email') && (
						<FieldDescription className='text-red-500'>
							{getFieldError('email')}
						</FieldDescription>
					)}
				</Field>

				<Field>
					<div className='flex items-center'>
						<FieldLabel htmlFor='password'>Password</FieldLabel>
						<a
							href='#'
							className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
						>
							Forgot your password?
						</a>
					</div>
					<div className='relative'>
						<Input
							id='password'
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
					{getFieldError('password') && (
						<FieldDescription className='text-red-500'>
							{getFieldError('password')}
						</FieldDescription>
					)}
				</Field>

				<Field>
					<Button type='submit' className='w-full' disabled={isPending}>
						{isPending ? 'Signing In...' : 'Sign In'}
						<LogIn className='w-4 h-4 ml-2' />
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
						Login with Google
					</Button>
					<FieldDescription className='text-center'>
						Don&apos;t have an account?{' '}
						<Link
							href='/register'
							className='underline-offset-4 hover:underline'
						>
							Register
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	)
}

export default LoginForm
