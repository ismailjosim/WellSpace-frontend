'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import AdvancedDoctorFilters from './AdvancedDoctorFilters'

interface DoctorSearchFiltersProps {
	specialties: Array<{ id: string; title: string }>
}

export default function DoctorSearchFilters({
	specialties,
}: DoctorSearchFiltersProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const urlSearchTerm = searchParams.get('searchTerm') || ''
	const urlMinFee = searchParams.get('minFee') || ''
	const urlMaxFee = searchParams.get('maxFee') || ''

	const [searchTerm, setSearchTerm] = useState(urlSearchTerm)
	const [prevUrlSearchTerm, setPrevUrlSearchTerm] = useState(urlSearchTerm)
	const [minFee, setMinFee] = useState(urlMinFee)
	const [prevUrlMinFee, setPrevUrlMinFee] = useState(urlMinFee)
	const [maxFee, setMaxFee] = useState(urlMaxFee)
	const [prevUrlMaxFee, setPrevUrlMaxFee] = useState(urlMaxFee)
	const [showAdvanced, setShowAdvanced] = useState(false)
	const isUserTypingRef = useRef(false)

	if (urlSearchTerm !== prevUrlSearchTerm) {
		setPrevUrlSearchTerm(urlSearchTerm)
		setSearchTerm(urlSearchTerm)
	}

	if (urlMinFee !== prevUrlMinFee) {
		setPrevUrlMinFee(urlMinFee)
		setMinFee(urlMinFee)
	}

	if (urlMaxFee !== prevUrlMaxFee) {
		setPrevUrlMaxFee(urlMaxFee)
		setMaxFee(urlMaxFee)
	}

	const debouncedSearch = useDebounce(searchTerm, 400)

	const updateFilters = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString())

			Object.entries(updates).forEach(([key, value]) => {
				if (value && value !== 'all') {
					params.set(key, value)
				} else {
					params.delete(key)
				}
			})

			params.delete('page')
			const query = params.toString()
			router.push(query ? `/consultation?${query}` : '/consultation')
		},
		[router, searchParams],
	)

	useEffect(() => {
		if (debouncedSearch === urlSearchTerm) {
			isUserTypingRef.current = false
			return
		}
		if (!isUserTypingRef.current) return
		isUserTypingRef.current = false
		updateFilters({ searchTerm: debouncedSearch })
	}, [debouncedSearch, urlSearchTerm, updateFilters])

	const handleApplyFee = () => {
		updateFilters({
			minFee: minFee.trim() ? minFee.trim() : null,
			maxFee: maxFee.trim() ? maxFee.trim() : null,
		})
	}

	const handleFeePreset = (min: string | null, max: string | null) => {
		setMinFee(min || '')
		setMaxFee(max || '')
		updateFilters({ minFee: min, maxFee: max })
	}

	const handleClearFilters = () => {
		isUserTypingRef.current = false
		setSearchTerm('')
		setMinFee('')
		setMaxFee('')
		router.push('/consultation')
	}

	const hasActiveFilters = Boolean(
		searchParams.get('searchTerm') ||
		searchParams.get('specialties') ||
		searchParams.get('gender') ||
		searchParams.get('minFee') ||
		searchParams.get('maxFee') ||
		searchParams.get('minRating') ||
		searchParams.get('minExperience') ||
		searchParams.get('sortBy'),
	)

	return (
		<div className='space-y-4 rounded-xl border bg-card p-4 shadow-xs'>
			<div className='flex flex-col gap-3 md:flex-row'>
				<div className='relative flex-1'>
					<Search
						className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground'
						aria-hidden='true'
					/>
					<Input
						aria-label='Search doctors'
						placeholder='Search doctors by name, qualification, or hospital...'
						value={searchTerm}
						onChange={(event) => {
							isUserTypingRef.current = true
							setSearchTerm(event.target.value)
						}}
						className='pl-10'
					/>
				</div>

				<Select
					value={searchParams.get('specialties') || 'all'}
					onValueChange={(value) => updateFilters({ specialties: value })}
				>
					<SelectTrigger className='w-full md:w-55' aria-label='Specialty'>
						<SelectValue placeholder='All Specialties' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Specialties</SelectItem>
						{specialties.map((specialty) => (
							<SelectItem key={specialty.id} value={specialty.title}>
								{specialty.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={
						searchParams.get('sortBy')
							? `${searchParams.get('sortBy')}_${searchParams.get('sortOrder') || 'desc'}`
							: 'default'
					}
					onValueChange={(value) => {
						if (value === 'default') {
							updateFilters({ sortBy: null, sortOrder: null })
						} else if (value === 'rating_desc') {
							updateFilters({ sortBy: 'averageRating', sortOrder: 'desc' })
						} else if (value === 'fee_asc') {
							updateFilters({ sortBy: 'appointmentFee', sortOrder: 'asc' })
						} else if (value === 'fee_desc') {
							updateFilters({ sortBy: 'appointmentFee', sortOrder: 'desc' })
						} else if (value === 'exp_desc') {
							updateFilters({ sortBy: 'experience', sortOrder: 'desc' })
						}
					}}
				>
					<SelectTrigger className='w-full md:w-50' aria-label='Sort by'>
						<SelectValue placeholder='Sort By' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='default'>Default Sorting</SelectItem>
						<SelectItem value='rating_desc'>Top Rated</SelectItem>
						<SelectItem value='fee_asc'>Fee: Low to High</SelectItem>
						<SelectItem value='fee_desc'>Fee: High to Low</SelectItem>
						<SelectItem value='exp_desc'>Most Experienced</SelectItem>
					</SelectContent>
				</Select>

				<Button
					type='button'
					variant={showAdvanced ? 'secondary' : 'outline'}
					onClick={() => setShowAdvanced((previous) => !previous)}
					className='flex items-center gap-2'
					aria-expanded={showAdvanced}
				>
					<SlidersHorizontal className='h-4 w-4' aria-hidden='true' />
					<span>Filters</span>
				</Button>

				{hasActiveFilters && (
					<Button
						type='button'
						variant='ghost'
						onClick={handleClearFilters}
						className='flex items-center gap-1 text-muted-foreground hover:text-foreground'
					>
						<X className='h-4 w-4' aria-hidden='true' />
						Clear
					</Button>
				)}
			</div>

			{showAdvanced && (
				<AdvancedDoctorFilters
					searchParams={searchParams}
					minFee={minFee}
					maxFee={maxFee}
					setMinFee={setMinFee}
					setMaxFee={setMaxFee}
					updateFilters={updateFilters}
					onApplyFee={handleApplyFee}
					onFeePreset={handleFeePreset}
				/>
			)}
		</div>
	)
}
