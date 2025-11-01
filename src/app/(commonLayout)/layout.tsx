import React from 'react'
import PublicNavbar from '@/components/shared/PublicNavbar'
import PublicFooter from '@/components/shared/PublicFooter'

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<PublicNavbar />
			<main className='min-h-screen'>{children}</main>
			<PublicFooter />
		</>
	)
}

export default CommonLayout
