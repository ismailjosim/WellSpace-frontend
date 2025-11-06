'use client'

import { useActionState } from 'react'
import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '@/services/auth/registerPatient'

const RegisterForm = () => {
	const [state, formAction, isPending] = useActionState(registerUser, null)
	console.log('result', state)
	return (
		<>
			<form action={formAction} className='space-y-6'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Full Name</Label>
					<Input
						type='text'
						id='name'
						name='name'
						required
						placeholder='John Doe'
						className='h-12'
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='email'>Email Address</Label>
					<Input
						type='email'
						id='email'
						name='email'
						required
						placeholder='your@email.com'
						className='h-12'
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='password'>Password</Label>
					<Input
						type='password'
						id='password'
						name='password'
						required
						placeholder='••••••••'
						className='h-12'
					/>
				</div>

				<Button
					type='submit'
					className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all duration-300'
					disabled={isPending}
				>
					{isPending ? 'Creating Account...' : 'Create Account'}
					<UserPlus className='w-5 h-5 ml-2' />
				</Button>
			</form>

			{/* Show error from either state or client-side validation */}
			{/* {(error || state?.error) && (
				<Alert variant='destructive' className='my-4'>
					<AlertDescription>{error || state?.error}</AlertDescription>
				</Alert>
			)} */}
		</>
	)
}

export default RegisterForm
