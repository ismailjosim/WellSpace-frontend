'use client'
import { logoutUser } from '@/services/auth/logoutUser'
import { Button } from '../ui/button'

const UserLogout = () => {
	const handleLogout = async () => {
		await logoutUser()
	}
	return (
		<Button className='w-full' onClick={handleLogout}>
			Logout
		</Button>
	)
}

export default UserLogout
