import ShopOrders from "@/components/modules/Medicine/ShopOrders";
import { getShopOrders } from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function ShopOrdersPage() {
  const result = await getShopOrders();
  if (!result.success || !Array.isArray(result.data)) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load orders."}
      </p>
    );
  }
  return <ShopOrders orders={result.data} />;
}
