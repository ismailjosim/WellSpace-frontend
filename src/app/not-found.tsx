'use client'

import Link from 'next/link'
import { Button } from '../components/ui/button'
import Lottie from 'lottie-react'
import errorAnimation from '../assets/Lonely404.json'

export default function Custom404() {
	return (
		<main className='container h-screen mx-auto my-20 flex flex-col md:flex-row items-center justify-center'>
			<div className='flex-1'>
				<h1 className='text-6xl font-bold'>404</h1>
				<p className='mt-4 text-lg'>
					Oops! The page you’re looking for can’t be found.
				</p>
				<div className='mt-6 space-x-4'>
					<Link href='/'>
						<Button variant='default'>Go to Home</Button>
					</Link>
					<Link href='/contact'>
						<Button variant='outline'>Contact Support</Button>
					</Link>
				</div>
			</div>

			<div className='flex-1 mt-10 md:mt-0 md:ml-10'>
				<Lottie
					animationData={errorAnimation}
					loop
					autoplay
					className='w-full h-full'
				/>
			</div>
		</main>
	)
}
