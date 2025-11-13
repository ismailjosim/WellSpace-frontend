import { getUserInfo } from '@/services/auth/getUserInfo'
import { NavSection } from '@/types/dashboard.interface'
import { UserInfo } from '@/types/user.interface'
import { getDefaultDashboardRoutes } from '../../../lib/auth-utils'
import { getNavItemsByRole } from '../../../lib/navitems.config'
import DashboardSidebarContent from './DashboardSidebarContent'

const DashboardSidebar = async () => {
	const userInfo = (await getUserInfo()) as UserInfo

	const navItems: NavSection[] = getNavItemsByRole(userInfo.role)
	const dashboardHome = getDefaultDashboardRoutes(userInfo.role)

	return (
		<DashboardSidebarContent
			userInfo={userInfo}
			navItems={navItems}
			dashboardHome={dashboardHome}
		/>
	)
}

export default DashboardSidebar
