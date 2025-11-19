import SpecialtiesManagementHeader from '@/components/modules/Admin/SpecialtiesManagement/SpecialtiesManagementHeader'
import RefreshButton from '@/components/shared/RefreshButton'
import { getSpecialties } from '@/services/admin/specialtiesManagement'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/shared/TableSkeleton'
import SpecialtiesTable from '@/components/modules/Admin/SpecialtiesManagement/specialtiesTable'

const SpecialtiesManagementPage = async () => {
	const result = await getSpecialties()
	return (
		<div className='space-y-6'>
			<SpecialtiesManagementHeader />
			<div className='flex'>
				<RefreshButton />
			</div>
			<Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
				<SpecialtiesTable specialties={result.data} />
			</Suspense>
		</div>
	)
}

export default SpecialtiesManagementPage
