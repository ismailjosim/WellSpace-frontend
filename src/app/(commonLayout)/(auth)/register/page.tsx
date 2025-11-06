import RegisterForm from '@/components/modules/Auth/RegisterForm'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import { HeartHandshake } from 'lucide-react'

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
						<CardTitle className='text-xl'>Create Your Account</CardTitle>
						<CardDescription className='mt-1'>
							Join WellSpace and start your wellness journey today.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent>
					{/* Register Form */}
					<RegisterForm />
				</CardContent>
			</Card>
		</div>
	)
}
export default RegisterPage
