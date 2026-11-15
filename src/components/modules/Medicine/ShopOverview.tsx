import {
  Activity,
  Boxes,
  CircleDollarSign,
  ClipboardList,
  PackageSearch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type PharmacyOverview = {
  totalProducts: number;
  activeProducts: number;
  pendingOrders: number;
  totalOrders: number;
  totalInventory: number;
  lowStockProducts: number;
  paidRevenue: number;
  currency: string;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(
    value,
  );

export default function ShopOverview({
  data,
  manager = false,
}: {
  data: PharmacyOverview;
  manager?: boolean;
}) {
  const cards = [
    {
      title: "Active products",
      value: data.activeProducts,
      icon: PackageSearch,
    },
    { title: "Pending orders", value: data.pendingOrders, icon: ClipboardList },
    { title: "Items in inventory", value: data.totalInventory, icon: Boxes },
    {
      title: "Low-stock products",
      value: data.lowStockProducts,
      icon: Activity,
    },
    { title: "Total orders", value: data.totalOrders, icon: ClipboardList },
    {
      title: "Paid revenue",
      value: money(data.paidRevenue),
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            WellSpace Pharmacy
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Shop overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {manager
              ? "Monitor orders, inventory and shop performance."
              : "A read-only summary of pharmacy operations."}
          </p>
        </div>
        {manager && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/shop/dashboard/medicines">Manage medicines</Link>
            </Button>
            <Button asChild className="bg-emerald-800 hover:bg-emerald-900">
              <Link href="/shop/dashboard/orders">Review orders</Link>
            </Button>
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className="size-4 text-emerald-700" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {data.totalProducts} products in catalog · Revenue is based on orders
        marked paid.
      </p>
    </div>
  );
}
