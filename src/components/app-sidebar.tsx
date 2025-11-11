'use client'

import * as React from 'react'
import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconFolder,
	IconHelp,
	IconInnerShadowTop,
	IconListDetails,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'

import { NavUser } from '@/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from '@/components/ui/sidebar'
import checkAuthStatus from '../utility/checkAuthStatus'

import clsx from 'clsx'

const { user } = await checkAuthStatus()
const { role } = user || { role: 'guest' }

const navMainItems = [
	{
		title: 'Dashboard',
		url: '#',
		icon: IconDashboard,
	},
]

if (role === 'ADMIN') {
	navMainItems.push(
		{
			title: 'Manage Doctors',
			url: '/dashboard/admin/manage-doctors',
			icon: IconUsers,
		},
		{
			title: 'Manage Patients',
			url: '/dashboard/admin/manage-patients',
			icon: IconUsers,
		},
	)
}

const data = {
	user: {
		name: user?.name,
		email: user?.email,
		avatar: user?.image,
	},
	navMain: navMainItems,
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<span className={clsx('text-lg font-semibold')}>
					WellSpace Dashboard
				</span>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className='mt-auto' /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	)
}
