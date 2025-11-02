'use client'

import { useState } from 'react'
import { HeartHandshake, UserPlus, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const RegisterPage = () => {
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleGoogleSignUp = async () => {
		// Add your Google OAuth logic here
		console.log('Sign up with Google')
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		const formData = new FormData(e.currentTarget)
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const confirmPassword = formData.get('confirmPassword') as string

		if (password !== confirmPassword) {
			setError('Passwords do not match')
			setIsLoading(false)
			return
		}

		// Add your registration logic here
		console.log('Register:', { email, password })

		setIsLoading(false)
	}

	return (
		<div className='min-h-screen flex items-center justify-center bg-secondary p-4'>
			<Card className='w-full max-w-md shadow-2xl'>
				<CardHeader className='text-center space-y-4'>
					<div className='flex items-center justify-center space-x-2'>
						<div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
							<HeartHandshake className='w-5 h-5 text-primary-foreground' />
						</div>
						<CardTitle className='text-3xl font-extrabold text-secondary'>
							WellSpace
						</CardTitle>
					</div>
					<div>
						<CardTitle className='text-xl'>
							Create Your WellSpace Account
						</CardTitle>
						<CardDescription className='mt-1'>
							Start connecting with care, anytime, anywhere.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent>
					{/* Error Message */}
					{error && (
						<Alert variant='destructive' className='mb-4'>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{/* Google Sign Up Button */}
					<Button
						type='button'
						variant='outline'
						className='w-full h-12 mb-4'
						onClick={handleGoogleSignUp}
					>
						<Mail className='w-5 h-5 mr-3 text-red-500' />
						<span>Sign up with Google</span>
					</Button>

					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<Separator className='flex-1' />
						<span className='text-sm font-medium text-muted-foreground'>
							OR
						</span>
						<Separator className='flex-1' />
					</div>

					{/* Register Form */}
					<form onSubmit={handleSubmit} className='space-y-6'>
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
						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								required
								placeholder='••••••••'
								className='h-12'
							/>
						</div>
						<Button
							type='submit'
							className='w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg transition-all duration-300'
							disabled={isLoading}
						>
							<span>Create Account</span>
							<UserPlus className='w-5 h-5 ml-2' />
						</Button>
					</form>

					{/* Login Link */}
					<div className='mt-6 text-center'>
						<Link
							href='/login'
							className='text-sm text-muted-foreground hover:text-primary-dark transition duration-300 font-medium'
						>
							Already have an account? Sign In
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
export default RegisterPage
