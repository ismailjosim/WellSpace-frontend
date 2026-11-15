import ShopInventory from "@/components/modules/Medicine/ShopInventory";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getShopMedicines } from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function ShopMedicinesPage() {
  const [result, user] = await Promise.all([getShopMedicines(), getUserInfo()]);
  if (!result.success || !Array.isArray(result.data)) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load medicine inventory."}
      </p>
    );
  }
  return (
    <ShopInventory
      medicines={result.data}
      manager={user?.role === "SHOP_MANAGER"}
    />
  );
}
