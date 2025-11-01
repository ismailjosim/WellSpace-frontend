'use client'

import { useState, useEffect } from 'react'
import {
	ChevronLeft,
	ChevronRight,
	Search,
	Calendar,
	Star,
	Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import slide01 from '@/assets/images/slide-01.jpeg'
import slide02 from '@/assets/images/slide-02.jpeg'
import slide03 from '@/assets/images/slide-03.jpeg'
import slide04 from '@/assets/images/slide-04.jpeg'

export default function HeroSection() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [symptoms, setSymptoms] = useState('')

	const backgroundImages = [slide01, slide02, slide03, slide04]

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
		}, 10000)
		return () => clearInterval(timer)
	}, [backgroundImages.length])

	// const nextSlide = () => {
	// 	setCurrentSlide((prev) => (prev + 1) % backgroundImages.length)
	// }

	// const prevSlide = () => {
	// 	setCurrentSlide(
	// 		(prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length,
	// 	)
	// }

	const goToSlide = (index: number) => {
		setCurrentSlide(index)
	}

	const handleGetRecommendations = () => {
		alert('Getting AI recommendations for: ' + symptoms)
	}

	return (
		<section className='relative w-full sm:h-screen flex justify-center items-center py-10 overflow-hidden bg-slate-900'>
			{/* === Background Image & Overlay === */}
			<div className='absolute inset-0'>
				{backgroundImages.map((image, index) => (
					<div
						key={index}
						className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
							index === currentSlide ? 'opacity-100' : 'opacity-0'
						}`}
					>
						<img
							src={image.src}
							alt={`Background ${index + 1}`}
							className='w-full h-full object-cover'
						/>
						<div className='absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_10%,rgba(0,0,0,0.2)_40%,rgba(20,184,166,0.6)_100%)] mix-blend-overlay opacity-[0.85]' />

						<div className='absolute inset-0 bg-black/30' />
					</div>
				))}
			</div>

			{/* === Main Content === */}
			<div className='relative flex items-center z-10 py-10 sm:px-0 px-5'>
				<div className='container mx-auto flex flex-col lg:flex-row items-center justify-between gap-10'>
					{/* === Left Section === */}
					<div className='flex-1 text-white space-y-6'>
						<div className='inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20'>
							<div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
							<span className='text-sm font-medium tracking-wider'>
								AI Powered Healthcare
							</span>
						</div>

						<h1 className='text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight'>
							Find Your Perfect Doctor with AI
						</h1>

						<p className='text-lg sm:text-xl text-gray-300 max-w-2xl leading-relaxed'>
							Our advanced AI technology analyzes your symptoms, medical
							history, and preferences to match you with the best-fit doctors in
							seconds.
						</p>

						{/* Action Buttons */}
						<div className='flex flex-wrap gap-4 pt-4'>
							<Button
								size={'lg'}
								className='inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
							>
								<Search className='w-5 h-5' />
								Find Your Doctor
							</Button>

							<Button
								size={'lg'}
								variant='outline'
								className='inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 text-white backdrop-blur-sm font-semibold rounded-lg transition-all duration-300'
							>
								<Calendar className='w-5 h-5' />
								Book Appointment
							</Button>
						</div>

						{/* Stats */}
						<div className='flex-wrap gap-8 pt-8 hidden sm:flex'>
							<div>
								<div className='text-4xl font-bold text-white'>50K+</div>
								<div className='text-sm text-gray-300 mt-1'>
									Patients Served
								</div>
							</div>
							<div>
								<div className='text-4xl font-bold text-white'>1000+</div>
								<div className='text-sm text-gray-300 mt-1'>Expert Doctors</div>
							</div>
							<div>
								<div className='flex items-center gap-2'>
									<span className='text-4xl font-bold text-white'>4.9</span>
									<Star className='w-8 h-8 fill-yellow-400 text-yellow-400' />
								</div>
								<div className='text-sm text-gray-300 mt-1'>Patient Rating</div>
							</div>
						</div>
					</div>

					{/* === Right Section: Glass Card === */}
					<div className='flex flex-1 sm:justify-end justify-center'>
						<Card className='w-full max-w-lg p-8 space-y-6 rounded-2xl border border-white/30 bg-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-white'>
							<div className='absolute inset-0 bg-linear-to-br from-white/40 via-white/10 to-transparent opacity-70 pointer-events-none' />

							<CardHeader className='relative z-10 flex items-center justify-between p-0'>
								<CardTitle className='text-2xl font-bold drop-shadow-md'>
									AI Doctor Finder
								</CardTitle>
								<Sparkles className='w-6 h-6 text-primary-foreground' />
							</CardHeader>

							<CardContent className='relative z-10 space-y-4'>
								<div>
									<label className='block text-sm font-medium text-white/90 mb-2'>
										What are your symptoms?
									</label>
									<Input
										type='text'
										placeholder='e.g. headache, fever, cough'
										value={symptoms}
										onChange={(e) => setSymptoms(e.target.value)}
										className='bg-white/20 border-white/30 py-5 text-white placeholder:text-white/60 focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-md'
									/>
								</div>

								<Button
									size={'lg'}
									onClick={handleGetRecommendations}
									className='w-full py-4 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-md'
								>
									Get AI Recommendations
								</Button>

								<div className='flex items-center justify-center gap-2 text-xs text-white/70'>
									<Sparkles className='w-3 h-3 text-teal-200' />
									<span>
										Powered by advanced AI algorithms for accurate doctor
										matching
									</span>
								</div>

								<div className='flex items-center justify-between pt-4 border-t border-white/20'>
									<div className='text-center'>
										<div className='text-2xl font-bold text-white'>50K+</div>
										<div className='text-xs text-white/70 mt-1'>
											Patients Served
										</div>
									</div>
									<div className='text-center'>
										<div className='text-2xl font-bold text-white'>1000+</div>
										<div className='text-xs text-white/70 mt-1'>
											Expert Doctors
										</div>
									</div>
									<div className='text-center'>
										<div className='flex items-center justify-center gap-1'>
											<span className='text-2xl font-bold text-white'>4.9</span>
											<Star className='w-5 h-5 fill-yellow-400 text-yellow-400' />
										</div>
										<div className='text-xs text-white/70 mt-1'>
											Patient Rating
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* === Dot Indicators === */}
			<div className='absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20'>
				{backgroundImages.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`transition-all duration-300 rounded-full ${
							index === currentSlide
								? 'w-12 h-3 bg-primary-dark'
								: 'w-3 h-3 bg-white/50 hover:bg-white/80'
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	)
}
