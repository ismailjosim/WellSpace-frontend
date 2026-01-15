import { Suspense } from 'react'
import MySchedulesFilters from '@/components/modules/Doctor/MySchedules/MyScheduleFilters'
import MySchedulesHeader from '@/components/modules/Doctor/MySchedules/MyScheduleHeader'
import { TableSkeleton } from '@/components/shared/TableSkeleton'
import MySchedulesTable from '@/components/modules/Doctor/MySchedules/MyScheduleTable'
import TablePagination from '@/components/shared/TablePagination'
import { queryStringFormatter } from '@/lib/formatters.ts'
import {
	getAvailableSchedules,
	getDoctorOwnSchedules,
} from '@/services/doctor/doctorScedule.services'

interface DoctorMySchedulesPageProps {
	searchParams: Promise<{
		page?: string
		limit?: string
		isBooked?: string
	}>
}

const DoctorMySchedulesPage = async ({
	searchParams,
}: DoctorMySchedulesPageProps) => {
	const params = await searchParams
	const queryString = queryStringFormatter(params)
	const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString)
	const availableSchedulesResponse = await getAvailableSchedules()

	const schedules = myDoctorsScheduleResponse?.data || []
	const meta = myDoctorsScheduleResponse?.meta
	const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 1))
	return (
		<div className='space-y-6'>
			<MySchedulesHeader
				availableSchedules={availableSchedulesResponse?.data || []}
			/>

			<MySchedulesFilters />

			<Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
				<MySchedulesTable schedules={schedules} />
				<TablePagination
					currentPage={meta?.page || 1}
					totalPages={totalPages || 1}
				/>
			</Suspense>
		</div>
	)
}

export default DoctorMySchedulesPage
