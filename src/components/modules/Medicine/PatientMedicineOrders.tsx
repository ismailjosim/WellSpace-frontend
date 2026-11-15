"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMedicinePrescription,
  startMedicinePayment,
} from "@/services/medicine/medicine.service";

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: string | number;
  createdAt: string;
  trackingNumber?: string | null;
  rejectionReason?: string | null;
  hasPrescription?: boolean;
  items: {
    productName: string;
    quantity: number;
    unitPrice: string | number;
  }[];
};

export default function PatientMedicineOrders({
  orders,
  paymentMessage,
}: {
  orders: Order[];
  paymentMessage?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const pay = async (id: string) => {
    setBusy(id);
    setError("");
    const result = await startMedicinePayment(id);
    setBusy("");
    if (!result.success || !result.data?.paymentUrl) {
      setError(result.message || "Unable to start online payment.");
      return;
    }
    window.location.assign(result.data.paymentUrl);
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
          Your pharmacy activity
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Medicine orders
        </h1>
      </div>
      {paymentMessage && (
        <p role="status" className="rounded-md border bg-muted/40 p-3 text-sm">
          {paymentMessage}
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {orders.length ? (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">
                  Order {order.id.slice(0, 8).toUpperCase()}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ৳{Number(order.totalAmount).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.status.replaceAll("_", " ")}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-1 text-sm">
                {order.items.map((item, index) => (
                  <li key={`${order.id}-${index}`}>
                    {item.productName} × {item.quantity}
                  </li>
                ))}
              </ul>
              {order.hasPrescription && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openPrescription(order.id)}
                >
                  View uploaded prescription
                </Button>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  Payment: {order.paymentStatus.toLowerCase()} via{" "}
                  {order.paymentMethod === "STRIPE"
                    ? "card"
                    : "cash on delivery"}
                  {order.trackingNumber &&
                    ` · Tracking: ${order.trackingNumber}`}
                </p>
                {order.status === "REJECTED" && order.rejectionReason && (
                  <p className="w-full text-sm text-destructive">
                    Reason: {order.rejectionReason}
                  </p>
                )}
                {order.status === "APPROVED" &&
                  order.paymentMethod === "STRIPE" &&
                  order.paymentStatus !== "PAID" && (
                    <Button
                      className="bg-emerald-800 hover:bg-emerald-900"
                      disabled={busy === order.id}
                      onClick={() => pay(order.id)}
                    >
                      {busy === order.id ? "Opening payment…" : "Pay securely"}
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            You have not placed any medicine orders yet.
          </CardContent>
        </Card>
      )}
      <Button variant="outline" onClick={() => router.push("/medicine")}>
        Browse medicines
      </Button>
    </div>
  );
}
