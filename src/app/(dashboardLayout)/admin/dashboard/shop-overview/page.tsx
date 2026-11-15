import ShopOverview, {
  type PharmacyOverview,
} from "@/components/modules/Medicine/ShopOverview";
import { getAdminShopOverview } from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function AdminShopOverviewPage() {
  const result = await getAdminShopOverview();
  if (!result.success || !result.data) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load pharmacy overview."}
      </p>
    );
  }
  return <ShopOverview data={result.data as PharmacyOverview} />;
}
