import { Suspense } from 'react'
import { queryStringFormatter } from '@/lib/formatters.ts'
import { getAdmins } from '@/services/admin/adminsManagement'
import AdminsManagementHeader from '@/components/modules/Admin/AdminsManagement/AdminsManagementHeader'
import AdminsFilter from '@/components/modules/Admin/AdminsManagement/AdminsFilter'
import { TableSkeleton } from '@/components/shared/TableSkeleton'
import TablePagination from '@/components/shared/TablePagination'
import AdminsTable from '@/components/modules/Admin/AdminsManagement/AdminsTable'

const AdminAdminsManagementPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
	const searchParamsObj = await searchParams
	const queryString = queryStringFormatter(searchParamsObj)
	const adminsResult = await getAdmins(queryString)

	const totalPages = Math.ceil(
		(adminsResult?.meta?.total || 1) / (adminsResult?.meta?.limit || 1),
	)

	return (
		<div className='space-y-6'>
			<AdminsManagementHeader />

			{/* Search, Filters */}
			<AdminsFilter />

			<Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
				<AdminsTable admins={adminsResult?.data || []} />
				<TablePagination
					currentPage={adminsResult?.meta?.page || 1}
					totalPages={totalPages || 1}
				/>
			</Suspense>
		</div>
	)
}

export default AdminAdminsManagementPage
