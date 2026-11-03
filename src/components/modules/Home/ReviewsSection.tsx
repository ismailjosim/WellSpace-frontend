'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	ChevronLeft,
	ChevronRight,
	Star,
	Quote,
	ShieldCheck,
} from 'lucide-react'

const reviews = [
	{
		id: 1,
		name: 'Alice Johnson',
		role: 'Verified Patient',
		text: 'The instant video consultation was remarkably smooth. Dr. Chen accurately diagnosed my symptoms and sent a digital prescription right to my dashboard.',
		avatarUrl: 'https://i.pravatar.cc/150?img=1',
		rating: 5,
		time: '2 days ago',
	},
	{
		id: 2,
		name: 'Michael Smith',
		role: 'Verified Patient',
		text: 'The AI doctor recommendation matched me with an endocrinologist within seconds. Truly the modern benchmark for telemedicine.',
		avatarUrl: 'https://i.pravatar.cc/150?img=12',
		rating: 5,
		time: '4 days ago',
	},
	{
		id: 3,
		name: 'Sarah Davis',
		role: 'Family Care Patient',
		text: 'Booking pediatric consultations for my children used to take days of clinic waiting. WellSpace solved that completely in one intuitive app.',
		avatarUrl: 'https://i.pravatar.cc/150?img=9',
		rating: 5,
		time: '1 week ago',
	},
	{
		id: 4,
		name: 'Diana Lee',
		role: 'Verified Patient',
		text: 'End-to-end encrypted consultations with downloadable PDF prescriptions and instant billing. The level of polish in 2026 is phenomenal.',
		avatarUrl: 'https://i.pravatar.cc/150?img=4',
		rating: 5,
		time: '1 week ago',
	},
	{
		id: 5,
		name: 'Edward Chen',
		role: 'Verified Patient',
		text: 'Saved hours of commute time. The doctor was attentive, thorough, and followed up via the integrated chat. Highly recommended!',
		avatarUrl: 'https://i.pravatar.cc/150?img=15',
		rating: 5,
		time: '2 weeks ago',
	},
]

export default function PatientReviews() {
	const swiperRef = useRef<SwiperType | null>(null)

	return (
		<section className='py-24 bg-linear-to-b from-background via-accent/20 to-background overflow-hidden w-full'>
			<div className='w-full max-w-7xl mx-auto px-4 sm:px-6 min-w-0'>
				{/* Section Header with Controls */}
				<div className='flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6'>
					<div className='space-y-4 max-w-xl'>
						<Badge
							variant='outline'
							className='rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]'
						>
							Patient Testimonials
						</Badge>
						<h2 className='text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground'>
							Loved by{' '}
							<span className='bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent'>
								Thousands
							</span>
						</h2>
						<p className='text-muted-foreground text-base leading-relaxed'>
							Read verified feedback from patients who experience compassionate,
							prompt, and secure digital healthcare on WellSpace.
						</p>
					</div>

					{/* Navigation Controls */}
					<div className='flex items-center gap-2'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => swiperRef.current?.slidePrev()}
							className='rounded-full h-11 w-11 border-border/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-xs'
							aria-label='Previous review'
						>
							<ChevronLeft className='h-5 w-5' />
						</Button>
						<Button
							variant='outline'
							size='icon'
							onClick={() => swiperRef.current?.slideNext()}
							className='rounded-full h-11 w-11 border-border/70 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-xs'
							aria-label='Next review'
						>
							<ChevronRight className='h-5 w-5' />
						</Button>
					</div>
				</div>

				{/* Reviews Slider */}
				<div className='w-full min-w-0 max-w-full overflow-hidden'>
					<Swiper
						onSwiper={(swiper) => {
							swiperRef.current = swiper
						}}
						modules={[Navigation, Autoplay]}
						slidesPerView={3}
						spaceBetween={24}
						loop={true}
						autoplay={{ delay: 6000, disableOnInteraction: false }}
						speed={600}
						slidesPerGroup={1}
						breakpoints={{
							0: { slidesPerView: 1 },
							768: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
						}}
						className='pb-4'
					>
						{reviews.map((review) => (
							<SwiperSlide key={review.id} className='h-auto'>
								<Card className='h-full rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300'>
									<CardContent className='p-0 space-y-4'>
										{/* Rating Stars & Quote Icon */}
										<div className='flex items-center justify-between'>
											<div className='flex text-amber-400 gap-0.5'>
												{Array.from({ length: review.rating }).map((_, idx) => (
													<Star
														key={idx}
														className='w-4 h-4 fill-amber-400 text-amber-400'
													/>
												))}
											</div>
											<Quote className='h-6 w-6 text-primary/30' />
										</div>

										{/* Review Text */}
										<p className='text-sm text-foreground/90 leading-relaxed italic'>
											&ldquo;{review.text}&rdquo;
										</p>
									</CardContent>

									{/* Patient Author Info */}
									<div className='pt-6 mt-4 border-t border-border/40 flex items-center justify-between'>
										<div className='flex items-center gap-3'>
											<Avatar className='w-10 h-10 border border-primary/20'>
												<AvatarImage src={review.avatarUrl} alt={review.name} />
												<AvatarFallback className='text-xs bg-primary/10 text-primary font-bold'>
													{review.name.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className='flex items-center gap-1.5'>
													<p className='font-bold text-sm text-foreground'>
														{review.name}
													</p>
													<ShieldCheck className='w-3.5 h-3.5 text-emerald-500' />
												</div>
												<p className='text-[11px] text-muted-foreground'>
													{review.role}
												</p>
											</div>
										</div>
										<span className='text-[11px] text-muted-foreground/80 font-medium'>
											{review.time}
										</span>
									</div>
								</Card>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</section>
	)
}
