import HealthRecordsClient from "@/components/modules/Patient/HealthRecords/HealthRecordsClient";
import { getMyHealthRecord } from "@/services/patient/health-record.service";

export const dynamic = "force-dynamic";

export default async function HealthRecordsPage() {
  const response = await getMyHealthRecord();

  if (!response?.success || !response?.data) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="text-2xl font-semibold">Health Records</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {response?.message || "Unable to load your health records."}
        </p>
      </div>
    );
  }

  return <HealthRecordsClient patient={response.data} />;
}
