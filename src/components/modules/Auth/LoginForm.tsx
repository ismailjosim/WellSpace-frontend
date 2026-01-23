'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { toast } from 'sonner'
// import getInputFieldError from '@/lib/getInputFieldError'
import InputFieldError from '../../shared/InputFieldError'

export function LoginForm({ redirect }: { redirect?: string }) {
	const [state, formAction, isPending] = useActionState(loginUser, null)
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()

	// ✅ handle toast + redirect logic
	useEffect(() => {
		if (!state) return

		if (state.success) {
			if (state.redirectTo) {
				router.push(state.redirectTo)
			}
		} else if (state.message && !state.success) {
			toast.error(state.message)
		}
	}, [state, router])

	return (
		<form action={formAction}>
			{redirect && <input type='hidden' name='redirect' value={redirect} />}

			<FieldGroup>
				{/* Email Field */}
				<Field>
					<FieldLabel htmlFor='email'>Email Address</FieldLabel>
					<Input
						defaultValue='jufanohime@mailinator.com'
						id='email'
						name='email'
						type='email'
						placeholder='your@email.com'
					/>
					<InputFieldError field='email' state={state} />
				</Field>

				{/* Password Field */}
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
							defaultValue='Mdjasim99@'
							id='password'
							name='password'
							type={showPassword ? 'text' : 'password'}
							placeholder='••••••••'
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
					<InputFieldError field='password' state={state} />
				</Field>

				{/* Submit Button */}
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
