import PatientMedicineOrders from "@/components/modules/Medicine/PatientMedicineOrders";
import {
  getMyMedicineOrders,
  verifyMedicinePayment,
} from "@/services/medicine/medicine.service";

export const dynamic = "force-dynamic";

export default async function PatientMedicineOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string; payment?: string }>;
}) {
  const params = await searchParams;
  const paymentResult = params?.session_id
    ? await verifyMedicinePayment(params.session_id)
    : undefined;
  const result = await getMyMedicineOrders();
  if (!result.success || !Array.isArray(result.data)) {
    return (
      <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm">
        {result.message || "Unable to load your medicine orders."}
      </p>
    );
  }
  return (
    <PatientMedicineOrders
      orders={result.data}
      paymentMessage={
        paymentResult?.success
          ? "Payment confirmed. Your order status is up to date."
          : params?.payment === "cancelled"
            ? "Payment was cancelled. You can try again after the shop approves your order."
            : paymentResult?.message
      }
    />
  );
}
