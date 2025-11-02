'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const topDoctors = [
	{
		id: 1,
		name: 'Dr. Alistair Chen',
		specialization: 'Cardiologist',
		rating: 4.9,
		reviews: 98,
		initials: 'DR A',
	},
	{
		id: 2,
		name: 'Dr. Evelyn Sharma',
		specialization: 'Dermatologist',
		rating: 4.8,
		reviews: 150,
		initials: 'DR B',
	},
	{
		id: 3,
		name: 'Dr. Javier Morales',
		specialization: 'General Practitioner',
		rating: 5.0,
		reviews: 210,
		initials: 'DR C',
	},
	{
		id: 4,
		name: 'Dr. Sophia Lee',
		specialization: 'Pediatrician',
		rating: 4.7,
		reviews: 75,
		initials: 'DR D',
	},
]

export default function TopDoctorsSection() {
	return (
		<section className='py-20 bg-linear-to-b from-secondary/5 via-background to-primary/5'>
			<div className='container mx-auto text-center'>
				<div className='space-y-4 mb-12'>
					<h2 className='text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>
						Our <span className='text-primary'>Top Doctors</span>
					</h2>
					<p className='text-slate-600 dark:text-slate-300 max-w-2xl mx-auto'>
						Trusted professionals ready to provide expert medical care and
						consultation.
					</p>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
					{topDoctors.map((doctor) => (
						<Card
							key={doctor.id}
							className='group relative rounded-2xl border border-slate-200 bg-white dark:bg-slate-900/50 shadow-lg hover:shadow-xl transition-all duration-300'
						>
							<CardContent className='flex flex-col items-center text-center p-6 space-y-4'>
								{/* Avatar */}
								<div className='w-20 h-20 flex items-center justify-center rounded-full bg-linear-to-br from-primary/10 to-secondary/20 border-2 border-primary/30 text-slate-700 font-semibold'>
									{doctor.initials}
								</div>

								{/* Info */}
								<div>
									<h3 className='text-lg font-bold text-slate-900 dark:text-white'>
										{doctor.name}
									</h3>
									<p className='text-primary text-sm font-medium mt-1'>
										{doctor.specialization}
									</p>
								</div>

								{/* Rating */}
								<div className='flex items-center justify-center gap-1 text-yellow-400 text-sm'>
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${
												i < Math.round(doctor.rating)
													? 'fill-yellow-400 text-yellow-400'
													: 'text-gray-300'
											}`}
										/>
									))}
									<span className='text-slate-600 dark:text-slate-300 ml-1'>
										({doctor.reviews} Reviews)
									</span>
								</div>

								{/* Button */}
								<Button
									variant='default'
									className='mt-2 bg-secondary hover:bg-secondary/90 text-white font-medium px-6'
								>
									View Profile
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
