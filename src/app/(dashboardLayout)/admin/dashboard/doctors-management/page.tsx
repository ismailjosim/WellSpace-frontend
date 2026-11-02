import { getSpecialties } from "@/services/admin/specialtiesManagement";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import DoctorsManagementHeader from "@/components/modules/Admin/DoctorsManagement/DoctorsManagementHeader";
import DoctorsTable from "@/components/modules/Admin/DoctorsManagement/DoctorsTable";
import { getDoctors } from "@/services/admin/doctorsManagement";
import { queryStringFormatter } from "@/lib/formatters.ts";
import TablePagination from "@/components/shared/TablePagination";
import DoctorFilters from "@/components/modules/Admin/DoctorsManagement/DoctorFilters";

const DoctorsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryStr = queryStringFormatter(searchParamsObj);
  const doctors = await getDoctors(queryStr);

  const specialties = await getSpecialties();

  // calculate pagination safely
  const total = Number(doctors?.meta?.total ?? 0);
  const limit = Number(doctors?.meta?.limit ?? 10) || 10;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <DoctorsManagementHeader specialties={specialties?.data || []} />
      <DoctorFilters specialties={specialties?.data || []} />
      <Suspense fallback={<TableSkeleton columns={2} rows={10} />}>
        <DoctorsTable
          doctors={Array.isArray(doctors?.data) ? doctors.data : []}
          specialties={specialties?.data || []}
        />
        <TablePagination
          currentPage={Number(doctors?.meta?.page ?? 1) || 1}
          totalPages={totalPages}
        />
      </Suspense>
    </div>
  );
};

export default DoctorsManagementPage;
