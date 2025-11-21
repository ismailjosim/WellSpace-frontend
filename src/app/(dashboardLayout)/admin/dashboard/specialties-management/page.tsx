import SpecialtiesManagementHeader from '@/components/modules/Admin/SpecialtiesManagement/SpecialtiesManagementHeader'
import RefreshButton from '@/components/shared/RefreshButton'
import { getSpecialties } from '@/services/admin/specialtiesManagement'
import { Suspense } from 'react'
import { TableSkeleton } from '@/components/shared/TableSkeleton'
import SpecialtiesTable from '@/components/modules/Admin/SpecialtiesManagement/specialtiesTable'
import TablePagination from '@/components/shared/TablePagination'
import { queryStringFormatter } from '@/lib/formatters.ts'

const SpecialtiesManagementPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
	const searchParamsObj = await searchParams
	const queryStr = queryStringFormatter(searchParamsObj)
	const result = await getSpecialties(queryStr)
	// calculate pagination
	const totalPages = Math.ceil(result.meta.total / result.meta.limit)
	return (
		<div className='space-y-6'>
			<SpecialtiesManagementHeader />
			<div className='flex'>
				<RefreshButton />
			</div>
			<Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
				<SpecialtiesTable specialties={result.data} />
				<TablePagination
					currentPage={result.meta.page}
					totalPages={totalPages}
				/>
			</Suspense>
		</div>
	)
}

export default SpecialtiesManagementPage
