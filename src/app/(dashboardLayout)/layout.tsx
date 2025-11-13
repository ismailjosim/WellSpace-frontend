import React from 'react'
import DashboardSidebar from '@/components/modules/Dashboard/DashboardSidebar'
import DashboardNav from '@/components/modules/Dashboard/DashboardNav'

const CommonDashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex h-screen overflow-hidden'>
			<DashboardSidebar />
			<div className='flex flex-1 flex-col overflow-hidden'>
				<DashboardNav />
				<main className='flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6'>
					<div>{children}</div>
				</main>
			</div>
		</div>
	)
}

export default CommonDashboardLayout
