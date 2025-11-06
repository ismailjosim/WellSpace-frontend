'use client'

import { useActionState, useState } from 'react'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginUser } from '@/services/auth/loginUser'

const LoginForm = () => {
	const [state, formAction, isPending] = useActionState(loginUser, null)

	console.log('state', state)

	const [showPassword, setShowPassword] = useState(false)

	return (
		<form action={formAction} className='space-y-6'>
			<div className='space-y-2'>
				<Label htmlFor='email'>Email Address</Label>
				<Input
					name='email'
					type='email'
					placeholder='your@email.com'
					className='h-12'
				/>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='password'>Password</Label>
				<div className='relative'>
					<Input
						type={showPassword ? 'text' : 'password'}
						name='password'
						placeholder='••••••••'
						className='h-12 pr-10'
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
			</div>

			{/* {error && (
				<Alert variant='destructive' className='mb-4'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)} */}

			<Button
				type='submit'
				className='w-full h-12 bg-primary hover:bg-primary-dark text-primary-foreground font-bold shadow-lg transition-all duration-300'
				disabled={isPending}
			>
				{isPending ? 'Signing In...' : 'Sign In'}
				<LogIn className='w-5 h-5 ml-2' />
			</Button>
		</form>
	)
}

export default LoginForm
