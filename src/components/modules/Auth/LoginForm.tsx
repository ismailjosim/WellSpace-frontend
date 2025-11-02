'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { set, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HeartHandshake, LogIn, Mail, Eye, EyeOff } from 'lucide-react'
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
import loginUser from '@/utility/login'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import checkAuthStatus from '../../../utility/checkAuthStatus'

// Zod schema for login validation
const loginSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z
		.string()
		.min(6, { message: 'Password must be at least 6 characters long.' }),
})

type LoginSchema = z.infer<typeof loginSchema>

const LoginForm = () => {
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
	})

	const handleGoogleSignIn = async () => {
		try {
			// Add your Google OAuth logic here
			// Example: window.location.href = '/api/auth/google'
			console.log('Sign in with Google')
			toast.info('Google sign in coming soon!', { duration: 2000 })
		} catch (err) {
			toast.error('Failed to connect with Google')
		}
	}

	const onSubmit = async (data: LoginSchema) => {
		setError('')
		setIsLoading(true)

		try {
			const result = await loginUser(data.email, data.password)

			if (result.success) {
				toast.success(result.message || 'Login successful!', {
					duration: 3000,
				})
				const authStatus = await checkAuthStatus()

				if (authStatus.isAuthenticated && authStatus.user) {
					const { role } = authStatus.user

					// USE SWITCH CASE FOR ROLE BASED REDIRECTION
					switch (role) {
						case 'ADMIN':
							router.push('/dashboard/admin')
							break
						case 'DOCTOR':
							router.push('/dashboard/doctor')
							break
						case 'PATIENT':
							router.push('/dashboard/patient')
							break
						default:
							router.push('/')
							break
					}
				} else {
					setError('Authentication failed after login.')
				}
			} else {
				setError(result.message || 'Invalid email or password.')
			}

			console.log(result)
		} catch (err) {
			setError('Invalid email or password.')
			toast.error('Login failed')
		} finally {
			setIsLoading(false)
		}
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
						<CardTitle className='text-xl'>Welcome Back</CardTitle>
						<CardDescription className='mt-1'>
							Sign in to access your WellSpace dashboard.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent>
					{/* Google Sign In Button */}
					<Button
						type='button'
						variant='outline'
						className='w-full h-12 mb-4'
						onClick={handleGoogleSignIn}
					>
						<Mail className='w-5 h-5 mr-3 text-red-500' />
						<span>Sign in with Google</span>
					</Button>

					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<Separator className='flex-1' />
						<span className='text-sm font-medium text-muted-foreground'>
							OR
						</span>
						<Separator className='flex-1' />
					</div>

					{/* Login Form */}
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email Address</Label>
							<Input
								type='email'
								id='email'
								placeholder='your@email.com'
								className='h-12'
								{...register('email')}
							/>
							{errors.email && (
								<p className='text-destructive text-sm'>
									{errors.email.message}
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Input
									type={showPassword ? 'text' : 'password'}
									id='password'
									placeholder='••••••••'
									className='h-12 pr-10'
									{...register('password')}
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
							{errors.password && (
								<p className='text-destructive text-sm'>
									{errors.password.message}
								</p>
							)}
						</div>
						{/* Error Message */}
						{error && (
							<Alert variant='destructive' className='mb-4'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<Button
							type='submit'
							className='w-full h-12 bg-primary hover:bg-primary-dark text-primary-foreground font-bold shadow-lg transition-all duration-300'
							disabled={isLoading}
						>
							{isLoading ? 'Signing In...' : 'Sign In'}
							<LogIn className='w-5 h-5 ml-2' />
						</Button>
					</form>

					{/* Register Link */}
					<div className='mt-6 text-center'>
						<Link
							href='/register'
							className='text-sm text-muted-foreground hover:text-primary-dark transition duration-300 font-medium'
						>
							Don&apos;t have an account? Register Here
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export default LoginForm
