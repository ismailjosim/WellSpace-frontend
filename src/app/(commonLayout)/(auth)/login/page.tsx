import LoginForm from '@/components/modules/Auth/LoginForm'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

import { HeartHandshake } from 'lucide-react'

const LoginPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ redirect?: string }>
}) => {
	const { redirect } = (await searchParams) || {}
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
					{/* Login Form */}
					<LoginForm redirect={redirect} />
				</CardContent>
			</Card>
		</div>
	)
}

export default LoginPage
