import LoginForm from '@/components/modules/Auth/LoginForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { HeartHandshake } from 'lucide-react'
import Link from 'next/link'

const LoginPage = () => {
	return (
		<>
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
						{/* <Button
							type='button'
							variant='outline'
							className='w-full h-12 mb-4'
							onClick={handleGoogleSignIn}
						>
							<Mail className='w-5 h-5 mr-3 text-red-500' />
							<span>Sign in with Google</span>
						</Button> */}

						{/* Divider */}
						<div className='flex items-center gap-4 my-6'>
							<Separator className='flex-1' />
							<span className='text-sm font-medium text-muted-foreground'>
								OR
							</span>
							<Separator className='flex-1' />
						</div>

						{/* Login Form */}
						<LoginForm />

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
		</>
	)
}

export default LoginPage
