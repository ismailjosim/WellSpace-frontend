import { getUserInfo } from '@/services/auth/getUserInfo'
import DashboardNavbarContent from './DashboardNavbarContent'
import { getNavItemsByRole } from '@/lib/navItems.config'
import { getDefaultDashboardRoutes } from '@/lib/auth-utils'
import { UserInfo } from '@/types/user.interface'

const DashboardNav = async () => {
	const userInfo = (await getUserInfo()) as UserInfo
	const navItems = getNavItemsByRole(userInfo.role)
	const dashboardHome = getDefaultDashboardRoutes(userInfo.role)
	return (
		<DashboardNavbarContent
			userInfo={userInfo}
			navItems={navItems}
			dashboardHome={dashboardHome}
		/>
	)
}

export default DashboardNav
