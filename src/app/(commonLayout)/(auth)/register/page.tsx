import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'
import { HeartHandshake, Mail } from 'lucide-react'
import Link from 'next/link'

import RegisterForm from '@/components/modules/Auth/RegisterForm'

const RegisterPage = () => {
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

					{/* Google Sign Up Button */}
					{/* <Button
						type='button'
						variant='outline'
						className='w-full h-12 mb-4'
						onClick={handleGoogleSignUp}
					>
						<Mail className='w-5 h-5 mr-3 text-red-500' />
						<span>Sign up with Google</span>
					</Button> */}

					{/* Divider */}
					<div className='flex items-center gap-4 my-6'>
						<Separator className='flex-1' />
						<span className='text-sm font-medium text-muted-foreground'>
							OR
						</span>
						<Separator className='flex-1' />
					</div>

					{/* Register Form */}
					<RegisterForm />
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
