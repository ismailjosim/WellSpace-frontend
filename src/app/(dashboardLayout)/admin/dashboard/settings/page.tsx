import { getAllAdminSettings } from "@/services/admin/settings.service";
import PlatformSettingsManager from "@/components/modules/Admin/Settings/PlatformSettingsManager";
import { Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const result = await getAllAdminSettings();
  const settingsList = result.data?.raw || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Platform Settings & Operational Parameters
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Dynamic configuration of clinical policies, cancellation horizons, fee
          structures, and emergency notices.
        </p>
      </div>

      <PlatformSettingsManager initialSettings={settingsList} />
    </div>
  );
}
