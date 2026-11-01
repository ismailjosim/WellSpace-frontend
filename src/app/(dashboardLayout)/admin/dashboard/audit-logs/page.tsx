import { getAuditLogs } from "@/services/admin/audit.service";
import AuditLogsTable from "@/components/modules/Admin/AuditLogs/AuditLogsTable";
import { Shield } from "lucide-react";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const limit =
    typeof params.limit === "string" ? parseInt(params.limit, 10) : 50;

  const result = await getAuditLogs({ page, limit });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            System Audit Logs & Regulatory Compliance
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Immutable event trails capturing administrative operations, clinical
          record changes, and user status modifications.
        </p>
      </div>

      <AuditLogsTable
        logs={result.data || []}
        meta={result.meta || { page: 1, limit: 50, total: 0 }}
      />
    </div>
  );
}
