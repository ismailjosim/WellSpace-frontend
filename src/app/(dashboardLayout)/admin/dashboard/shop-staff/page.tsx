import ShopStaffManagement from "@/components/modules/Medicine/ShopStaffManagement";
import { getShopStaff } from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function AdminShopStaffPage() {
  const result = await getShopStaff();
  if (!result.success || !Array.isArray(result.data)) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load shop staff."}
      </p>
    );
  }
  return <ShopStaffManagement staff={result.data} />;
}
