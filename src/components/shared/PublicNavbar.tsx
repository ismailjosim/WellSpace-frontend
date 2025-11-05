/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
	Menu,
	X,
	Home,
	Stethoscope,
	HeartHandshake,
	Syringe,
	Microscope,
	Users,
} from 'lucide-react'
import { Button } from '../ui/button'
import checkAuthStatus from '@/utility/checkAuthStatus'

const baseLinks = [
	{ name: 'Home', href: '/', icon: Home },
	{ name: 'Consultation', href: '/consultation', icon: Stethoscope },
	{ name: 'Health Plans', href: '/health-plans', icon: HeartHandshake },
	{ name: 'Medicine', href: '/medicine', icon: Syringe },
	{ name: 'Diagnostics', href: '/diagnostics', icon: Microscope },
	{ name: 'NGOs', href: '/ngos', icon: Users },
]

const PublicNavbar = () => {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const [user, setUser] = useState<any>(null)

	// ✅ Fetch auth status on mount
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await checkAuthStatus()
				setUser(res?.user || null)
			} catch (err) {
				console.error('Auth check failed:', err)
			}
		}
		fetchUser()
	}, [])

	const role = user?.role || 'guest'
	const links =
		role && role !== 'guest'
			? [...baseLinks, { name: 'Dashboard', href: '/dashboard', icon: Home }]
			: baseLinks

	const isActive = (href: string) => {
		return href === '/' ? pathname === href : pathname.startsWith(href)
	}

	const linkStyle = 'transition duration-300 font-medium text-lg'
	const buttonStyle =
		'px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow-lg hover:bg-primary/90 transition duration-300 ease-in-out transform hover:scale-[1.02] dark:shadow-none'
	const logoColor = 'text-secondary'

	const mobileLinkClasses = (href: string) =>
		clsx(
			'flex items-center space-x-3 w-full py-2 rounded-md text-base transition-colors duration-200',
			isActive(href)
				? 'text-primary font-semibold border-l-4 border-primary bg-primary/5'
				: 'text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:font-medium',
		)

	return (
		<div className='w-full'>
			<header className='sticky top-0 z-50 bg-background dark:bg-card shadow-md'>
				<div className='container mx-auto'>
					<div className='flex justify-between items-center h-20'>
						{/* --- Logo --- */}
						<Link
							href='/'
							className='flex items-center space-x-2'
							onClick={() => setIsOpen(false)}
						>
							<div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
								<Stethoscope className='w-4 h-4 text-primary-foreground' />
							</div>
							<span className={clsx('text-2xl font-extrabold', logoColor)}>
								WellSpace
							</span>
						</Link>

						{/* --- Desktop Navigation --- */}
						<nav className='hidden lg:flex space-x-8'>
							{links.map((link) => (
								<Link
									key={link.name}
									href={link.href}
									className={clsx(
										linkStyle,
										isActive(link.href)
											? 'text-primary border-b-2 border-primary pb-1'
											: 'text-muted-foreground hover:text-primary',
									)}
								>
									{link.name}
								</Link>
							))}
						</nav>

						{/* --- Action Buttons + Mobile Toggle --- */}
						<div className='flex items-center'>
							{user ? (
								<Button className={clsx(buttonStyle, 'hidden lg:inline-flex')}>
									Logout
								</Button>
							) : (
								<Button
									asChild
									className={clsx(buttonStyle, 'hidden lg:inline-flex')}
								>
									<Link href={'/login'}>Login</Link>
								</Button>
							)}

							{/* Mobile Menu Toggle */}
							<button
								onClick={() => setIsOpen(!isOpen)}
								className='lg:hidden p-2 text-foreground/80 hover:text-primary transition duration-200'
								aria-label={isOpen ? 'Close menu' : 'Open menu'}
							>
								{isOpen ? (
									<X className='w-6 h-6' />
								) : (
									<Menu className='w-6 h-6' />
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* --- Mobile Drawer --- */}
			<>
				{/* Overlay */}
				<div
					className={clsx(
						'fixed inset-0 top-20 z-40 lg:hidden bg-black/50 transition-opacity duration-300',
						isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
					)}
					onClick={() => setIsOpen(false)}
				/>

				{/* Drawer Content */}
				<div
					className={clsx(
						'fixed left-0 top-20 bottom-0 z-50 lg:hidden w-72 bg-background dark:bg-card shadow-xl p-4 flex flex-col space-y-4 transform transition-transform duration-300 ease-in-out',
						isOpen ? 'translate-x-0' : '-translate-x-full',
					)}
				>
					<nav className='flex flex-col space-y-2'>
						{links.map((link) => (
							<Link
								key={link.name}
								href={link.href}
								onClick={() => setIsOpen(false)}
								className={mobileLinkClasses(link.href)}
							>
								<link.icon className='w-5 h-5 mr-3' />
								{link.name}
							</Link>
						))}
					</nav>

					<div className='pt-4 border-t border-border mt-auto'>
						<Button className={clsx(buttonStyle, 'w-full px-4 py-3 text-lg')}>
							{user ? 'Logout' : 'Login'}
						</Button>
					</div>
				</div>
			</>
		</div>
	)
}

export default PublicNavbar
