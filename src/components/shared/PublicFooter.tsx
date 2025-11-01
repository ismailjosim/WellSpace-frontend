'use client'

import Link from 'next/link'
import { Stethoscope, Twitter, Linkedin, Facebook } from 'lucide-react'

const PublicFooter = () => {
	const companyLinks = [
		{ name: 'About Us', href: '/about' },
		{ name: 'Careers', href: '/careers' },
		{ name: 'Blog', href: '/blog' },
	]

	const supportLinks = [
		{ name: 'Help Center', href: '/help' },
		{ name: 'FAQ', href: '/faq' },
		{ name: 'Contact Us', href: '/contact' },
	]

	const legalLinks = [
		{ name: 'Terms of Service', href: '/terms' },
		{ name: 'Privacy Policy', href: '/privacy' },
		{ name: 'Consent Forms', href: '/consent' },
	]

	const socialLinks = [
		{ name: 'Twitter', href: '#', icon: Twitter },
		{ name: 'LinkedIn', href: '#', icon: Linkedin },
		{ name: 'Facebook', href: '#', icon: Facebook },
	]

	return (
		<footer className='bg-secondary-foreground text-white'>
			<div className='container mx-auto py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					{/* Brand Section */}
					<div className='space-y-4'>
						<div className='flex items-center space-x-2'>
							<div className='w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center'>
								<Stethoscope className='w-5 h-5 text-white' />
							</div>
							<span className='text-2xl font-bold'>WellSpace</span>
						</div>
						<p className='text-blue-200 text-sm'>
							Connecting Care, Anytime, Anywhere.
						</p>
						<div className='flex space-x-4'>
							{socialLinks.map((social) => (
								<Link
									key={social.name}
									href={social.href}
									className='text-blue-200 hover:text-white transition-colors duration-200'
									aria-label={social.name}
								>
									<social.icon className='w-5 h-5' />
								</Link>
							))}
						</div>
					</div>

					{/* Company Links */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Company</h3>
						<ul className='space-y-3'>
							{companyLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-blue-200 hover:text-white transition-colors duration-200 text-sm'
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support Links */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Support</h3>
						<ul className='space-y-3'>
							{supportLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-blue-200 hover:text-white transition-colors duration-200 text-sm'
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div>
						<h3 className='text-lg font-semibold mb-4'>Legal</h3>
						<ul className='space-y-3'>
							{legalLinks.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-blue-200 hover:text-white transition-colors duration-200 text-sm'
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className='mt-12 pt-8 border-t border-blue-700'>
					<p className='text-center text-blue-300 text-sm'>
						© 2025 WellSpace. All rights reserved. Designed with modern web
						standards.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default PublicFooter
