import { getUserInfo } from '@/services/auth/getUserInfo'
import DashboardNavbarContent from './DashboardNavbarContent'

const DashboardNav = async () => {
	const userInfo = await getUserInfo()
	return <DashboardNavbarContent userInfo={userInfo} />
}

export default DashboardNav
