import ShopOverview, {
  type PharmacyOverview,
} from "@/components/modules/Medicine/ShopOverview";
import { getShopOverview } from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function ShopDashboardPage() {
  const result = await getShopOverview();
  if (!result.success || !result.data) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load shop overview."}
      </p>
    );
  }
  return <ShopOverview data={result.data as PharmacyOverview} manager />;
}
