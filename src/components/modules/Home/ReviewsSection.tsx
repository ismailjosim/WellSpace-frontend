/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	ArrowBigLeft,
	ArrowBigRight,
	LucideLinkedin,
	Sparkles,
	Star,
} from 'lucide-react'

const reviews = [
	{
		id: 1,
		name: 'Alice Johnson',
		text: 'Great service! The doctors were very professional and caring. Highly satisfied with my experience.',
		avatarUrl: 'https://i.pravatar.cc/150?img=1',
		rating: 5,
		platform: 'facebook',
		time: '2 days ago',
	},
	{
		id: 2,
		name: 'Bob Smith',
		text: 'Very professional staff and excellent facilities. Would definitely recommend to friends and family.',
		avatarUrl: 'https://i.pravatar.cc/150?img=2',
		rating: 5,
		platform: 'google',
		time: '6 days ago',
	},
	{
		id: 3,
		name: 'Charlie Davis',
		text: 'Highly recommend! The AI-powered doctor matching was incredibly accurate and saved me so much time.',
		avatarUrl: 'https://i.pravatar.cc/150?img=3',
		rating: 5,
		platform: 'facebook',
		time: '3 days ago',
	},
	{
		id: 4,
		name: 'Diana Lee',
		text: 'Amazing experience from start to finish. The booking process was seamless and the care was exceptional.',
		avatarUrl: 'https://i.pravatar.cc/150?img=4',
		rating: 5,
		platform: 'amazon',
		time: '5 days ago',
	},
	{
		id: 5,
		name: 'Edward Chen',
		text: 'The AI doctor finder is revolutionary! Found the perfect specialist for my needs in minutes.',
		avatarUrl: 'https://i.pravatar.cc/150?img=5',
		rating: 5,
		platform: 'google',
		time: '1 week ago',
	},
	{
		id: 6,
		name: 'Fiona Martinez',
		text: 'Outstanding healthcare service. The staff was attentive and the facilities were top-notch.',
		avatarUrl: 'https://i.pravatar.cc/150?img=6',
		rating: 5,
		platform: 'facebook',
		time: '4 days ago',
	},
]

export default function PatientReviews() {
	const swiperRef = useRef<any>(null)

	return (
		<div className='relative container mx-auto py-20'>
			{/* Navigation Buttons */}
			<button
				onClick={() => swiperRef.current?.slidePrev()}
				className='absolute left-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full z-10 shadow-md'
			>
				<ArrowBigLeft />
			</button>
			<button
				onClick={() => swiperRef.current?.slideNext()}
				className='absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full z-10 shadow-md'
			>
				<ArrowBigRight />
			</button>

			<Swiper
				onSwiper={(swiper) => (swiperRef.current = swiper)}
				modules={[Navigation, Autoplay]}
				slidesPerView={3}
				spaceBetween={20}
				loop={true}
				autoplay={{ delay: 5000 }}
				speed={600}
				slidesPerGroup={1}
				breakpoints={{
					0: { slidesPerView: 1 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 3 },
				}}
			>
				{reviews.map((review) => (
					<SwiperSlide key={review.id}>
						<Card className='p-5 rounded-xl shadow-md bg-white h-full flex flex-col justify-between'>
							{/* Header */}
							<div className='flex items-center justify-between mb-3'>
								<div className='flex items-center'>
									<Avatar className='w-10 h-10'>
										<AvatarImage src={review.avatarUrl} alt={review.name} />
										<AvatarFallback>JD</AvatarFallback>
									</Avatar>
									<div className='ml-3'>
										<p className='font-semibold text-md'>{review.name}</p>
										<div className='flex text-yellow-400 '>
											{Array.from({ length: review.rating }).map((_, idx) => (
												<Sparkles
													className='transform rotate-45'
													key={idx}
													size={20}
												/>
											))}
										</div>
									</div>
								</div>
								<span className='text-xs text-muted-foreground'>
									{review.time}
								</span>
							</div>

							{/* Review Text */}
							<CardContent className='p-0'>
								<p className='text-sm text-gray-700 mb-4'>{review.text}</p>
							</CardContent>

							{/* Platform */}
							<div>
								<span className='bg-primary inline-block p-1 rounded-full'>
									<LucideLinkedin className='text-white' size={20} />
								</span>
							</div>
						</Card>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
