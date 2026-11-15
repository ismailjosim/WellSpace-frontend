"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getMedicinePrescription,
  updateMedicineOrderStatus,
} from "@/services/medicine/medicine.service";

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: string | number;
  deliveryAddress: string;
  contactNumber: string;
  hasPrescription?: boolean;
  createdAt: string;
  patient?: { name: string; email: string; contactNumber?: string };
  items: {
    productName: string;
    quantity: number;
    unitPrice: string | number;
  }[];
};

const transitions: Record<string, string[]> = {
  PENDING_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["PROCESSING"],
  PROCESSING: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

export default function ShopOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const updateOrder = async (id: string, formData: FormData) => {
    setBusy(id);
    setError("");
    const payload = {
      status: String(formData.get("status") || ""),
      rejectionReason: String(formData.get("rejectionReason") || ""),
      trackingNumber: String(formData.get("trackingNumber") || ""),
    };
    const result = await updateMedicineOrderStatus(id, payload);
    setBusy("");
    if (!result.success) {
      setError(result.message || "Unable to update the order.");
      return;
    }
    router.refresh();
  };

  const openPrescription = async (id: string) => {
    setError("");
    const result = await getMedicinePrescription(id);
    if (!result.success || !result.data?.url) {
      setError(result.message || "Unable to open the prescription.");
      return;
    }
    window.open(result.data.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Pharmacy operations
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Customer orders
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review prescription orders, confirm payment and manage delivery
          status.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {orders.length ? (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <CardTitle className="text-base">
                  Order {order.id.slice(0, 8).toUpperCase()}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.patient?.name || "Patient"} ·{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : ""}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold">
                  ৳{Number(order.totalAmount).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.status.replaceAll("_", " ")} ·{" "}
                  {order.paymentMethod === "STRIPE"
                    ? "Card"
                    : "Cash on delivery"}{" "}
                  ({order.paymentStatus.toLowerCase()})
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Contact:</span>{" "}
                  {order.contactNumber}
                </p>
                <p>
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {order.deliveryAddress}
                </p>
              </div>
              <ul className="space-y-1 rounded-lg bg-muted/40 p-3 text-sm">
                {order.items.map((item, index) => (
                  <li
                    key={`${order.id}-${index}`}
                    className="flex justify-between gap-3"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>
                      ৳{(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              {order.hasPrescription && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPrescription(order.id)}
                >
                  Review prescription securely
                </Button>
              )}
              {(transitions[order.status] || []).length > 0 && (
                <form
                  action={(formData) => updateOrder(order.id, formData)}
                  className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <Select
                    name="status"
                    defaultValue={transitions[order.status][0]}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transitions[order.status].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    name="rejectionReason"
                    placeholder="Reason if rejecting"
                  />
                  <Input
                    name="trackingNumber"
                    placeholder="Tracking number if shipping"
                  />
                  <Button
                    className="bg-emerald-800 hover:bg-emerald-900"
                    disabled={busy === order.id}
                  >
                    {busy === order.id ? "Updating…" : "Update order"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No orders have been placed yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
