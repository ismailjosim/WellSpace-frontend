import MedicineStore from "@/components/modules/Medicine/MedicineStore";
import { getMedicines } from "@/services/medicine/medicine.service";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { getCookie } from "@/services/auth/tokenHandlers";

export const dynamic = "force-dynamic";

export default async function MedicinePage() {
  const [result, user, accessToken] = await Promise.all([
    getMedicines(),
    getUserInfo(),
    getCookie("accessToken"),
  ]);
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <MedicineStore
        medicines={
          result.success && Array.isArray(result.data) ? result.data : []
        }
        role={accessToken ? user?.role : undefined}
      />
    </div>
  );
}
