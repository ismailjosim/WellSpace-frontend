'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
	HeartPulse,
	Brain,
	Stethoscope,
	Baby,
	Eye,
	Bone,
	Activity,
	User,
} from 'lucide-react'

const specialists = [
	{ id: 1, name: 'Cardiology', icon: HeartPulse },
	{ id: 2, name: 'Neurology', icon: Brain },
	{ id: 3, name: 'General Medicine', icon: Stethoscope },
	{ id: 4, name: 'Pediatrics', icon: Baby },
	{ id: 5, name: 'Ophthalmology', icon: Eye },
	{ id: 6, name: 'Orthopedics', icon: Bone },
	{ id: 7, name: 'Physiotherapy', icon: Activity },
	{ id: 8, name: 'Family Health', icon: User },
]

export default function SpecialistsSection() {
	return (
		<section className='relative py-20 bg-linear-to-b from-primary/5 via-background to-secondary/10'>
			<div className='container mx-auto px-6 text-center'>
				<div className='space-y-4 mb-12'>
					<h2 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
						Our <span className='text-primary'>Specialists</span>
					</h2>
					<p className='text-slate-600 dark:text-slate-300 max-w-2xl mx-auto'>
						Meet our highly qualified doctors across multiple departments —
						powered by AI to match you with the best expertise.
					</p>
				</div>

				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6'>
					{specialists.map((item) => {
						const Icon = item.icon
						return (
							<Card
								key={item.id}
								className='group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]'
							>
								<CardContent className='flex flex-col items-center justify-center p-8 space-y-4'>
									<div className='p-4 rounded-full bg-linear-to-br from-primary/70 to-secondary/70 text-white shadow-lg group-hover:scale-110 transition-transform duration-300'>
										<Icon className='w-8 h-8' />
									</div>
									<h3 className='text-lg font-semibold text-slate-900 dark:text-white'>
										{item.name}
									</h3>
								</CardContent>

								{/* Decorative glow */}
								<div className='absolute inset-0 opacity-0 group-hover:opacity-100 bg-linear-to-t from-primary/30 via-transparent to-transparent transition-opacity duration-500 rounded-2xl pointer-events-none' />
							</Card>
						)
					})}
				</div>
			</div>
		</section>
	)
}
