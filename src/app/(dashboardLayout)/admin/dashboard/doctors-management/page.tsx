import RefreshButton from '@/components/shared/RefreshButton'
import { getSpecialties } from '@/services/admin/specialtiesManagement'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/shared/TableSkeleton'
import DoctorsManagementHeader from '@/components/modules/Admin/DoctorsManagement/DoctorsManagementHeader'
import DoctorsTable from '@/components/modules/Admin/DoctorsManagement/DoctorsTable'
import { getDoctors } from '@/services/admin/doctorsManagement'
import SearchFilter from '@/components/shared/SearchFilter'
import SelectFilter from '@/components/shared/SelectFilter'
import { ISpecialty } from '@/types/specialties.interface'

const DoctorsManagementPage = async () => {
	const doctors = await getDoctors()
	const specialties = await getSpecialties()
	return (
		<div className='space-y-6'>
			<DoctorsManagementHeader specialties={specialties.data} />
			<div className='flex space-x-2'>
				<SearchFilter placeholder='Search doctors...' />
				<SelectFilter
					paramName='specialty'
					options={specialties.data.map((specialty: ISpecialty) => ({
						label: specialty.title,
						value: specialty.id,
					}))}
					placeholder='Filter by specialty'
				/>
				<RefreshButton />
			</div>
			<Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
				<DoctorsTable doctors={doctors.data} specialties={specialties.data} />
			</Suspense>
		</div>
	)
}

export default DoctorsManagementPage
