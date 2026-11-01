import { getPrescriptionById } from "@/services/patient/prescription.service";
import PrescriptionPrintView from "@/components/modules/Patient/PatientPrescription/PrescriptionPrintView";
import { notFound } from "next/navigation";

interface PrescriptionDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function PrescriptionDetailsPage({
  params,
}: PrescriptionDetailsPageProps) {
  const { id } = await params;
  const res = await getPrescriptionById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <PrescriptionPrintView prescription={res.data} />
    </div>
  );
}
