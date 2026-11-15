"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, Pill, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { placeMedicineOrder } from "@/services/medicine/medicine.service";

type Medicine = {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  category: string;
  description: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  price: number | string;
  stock: number;
  imageUrl?: string | null;
  requiresPrescription: boolean;
};

type CartLine = { medicine: Medicine; quantity: number };

const formatPrice = (price: number | string) =>
  `৳${Number(price).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

export default function MedicineStore({
  medicines,
  role,
}: {
  medicines: Medicine[];
  role?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const requiresPrescription = cart.some(
    (line) => line.medicine.requiresPrescription,
  );
  const total = cart.reduce(
    (sum, line) => sum + Number(line.medicine.price) * line.quantity,
    0,
  );
  const categories = useMemo(
    () => [...new Set(medicines.map((medicine) => medicine.category))].sort(),
    [medicines],
  );
  const filtered = medicines.filter((medicine) => {
    const matchesCategory =
      category === "all" || medicine.category === category;
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      [
        medicine.name,
        medicine.genericName,
        medicine.brand,
        medicine.manufacturer,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);
    return matchesCategory && matchesSearch;
  });
  const canOrder = role === "PATIENT";

  const addToCart = (medicine: Medicine) => {
    setCart((current) => {
      const existing = current.find((line) => line.medicine.id === medicine.id);
      if (existing) {
        return current.map((line) =>
          line.medicine.id === medicine.id
            ? { ...line, quantity: Math.min(line.quantity + 1, medicine.stock) }
            : line,
        );
      }
      return [...current, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((current) =>
      current
        .map((line) => (line.medicine.id === id ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  };

  const submitOrder = async (formData: FormData) => {
    setBusy(true);
    setError("");
    setMessage("");
    formData.set(
      "items",
      JSON.stringify(
        cart.map(({ medicine, quantity }) => ({
          medicineId: medicine.id,
          quantity,
        })),
      ),
    );
    const result = await placeMedicineOrder(formData);
    setBusy(false);
    if (!result.success) {
      setError(result.message || "Your order could not be submitted.");
      return;
    }
    setMessage(
      "Order submitted. The pharmacy will review it before processing.",
    );
    setCart([]);
    setCheckoutOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-teal-800 px-6 py-10 text-white md:px-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-4">
            <Badge className="border-white/30 bg-white/10 text-white">
              WellSpace Pharmacy
            </Badge>
            <h1 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Everyday care, delivered to your door.
            </h1>
            <p className="max-w-xl text-sm text-emerald-50/90 md:text-base">
              Browse trusted health essentials and prescription medicines. Every
              order is reviewed by our pharmacy team.
            </p>
            <div className="flex flex-wrap gap-3 pt-1 text-sm text-emerald-50">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4" /> Verified products
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4" /> Nationwide delivery
              </span>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="flex size-48 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
              <div className="flex size-32 items-center justify-center rounded-full bg-white text-emerald-800 shadow-xl">
                <Pill className="size-16" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search medicines, brands, or ingredients"
                className="h-11 pl-10"
              />
            </div>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value || "all")}
            >
              <SelectTrigger className="h-11 w-full sm:w-56">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filtered.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((medicine) => (
                <Card
                  key={medicine.id}
                  className="overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div className="flex h-40 items-center justify-center bg-emerald-50 p-4 dark:bg-emerald-950/30">
                    {medicine.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="h-full max-w-full object-contain"
                      />
                    ) : (
                      <Pill className="size-16 text-emerald-700/70" />
                    )}
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-semibold leading-tight">
                          {medicine.name}
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {medicine.genericName} · {medicine.strength}
                        </p>
                      </div>
                      {medicine.requiresPrescription && (
                        <Badge variant="outline">Rx</Badge>
                      )}
                    </div>
                    <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                      {medicine.description}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                          {formatPrice(medicine.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {medicine.stock > 0
                            ? `${medicine.stock} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        disabled={!canOrder || medicine.stock < 1}
                        onClick={() => addToCart(medicine)}
                        className="gap-1.5 bg-emerald-800 hover:bg-emerald-900"
                      >
                        <ShoppingBag className="size-4" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
              {medicines.length
                ? "No medicines match your search."
                : "The shop is preparing its catalog. Please check back soon."}
            </div>
          )}
          {!canOrder && (
            <p className="text-sm text-muted-foreground">
              Sign in with a patient account to add items to your cart and place
              an order.
            </p>
          )}
        </section>

        <aside className="h-fit rounded-2xl border bg-card p-5 lg:sticky lg:top-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your basket</h2>
            <Badge variant="secondary">
              {cart.reduce((sum, line) => sum + line.quantity, 0)} items
            </Badge>
          </div>
          <div className="mt-4 space-y-4">
            {cart.length ? (
              cart.map(({ medicine, quantity }) => (
                <div
                  key={medicine.id}
                  className="flex items-center justify-between gap-3 border-b pb-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {medicine.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(medicine.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      onClick={() => updateQuantity(medicine.id, quantity - 1)}
                      aria-label={`Remove one ${medicine.name}`}
                    >
                      −
                    </Button>
                    <span className="w-5 text-center text-sm">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-7"
                      disabled={quantity >= medicine.stock}
                      onClick={() => updateQuantity(medicine.id, quantity + 1)}
                      aria-label={`Add one ${medicine.name}`}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                Your basket is empty.
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 font-semibold">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          {requiresPrescription && (
            <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              A valid prescription is required for at least one item in this
              basket.
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="mt-3 text-sm text-emerald-700">
              {message}
            </p>
          )}
          {checkoutOpen && (
            <form action={submitOrder} className="mt-4 space-y-3">
              <Input
                name="contactNumber"
                required
                minLength={7}
                placeholder="Contact number"
              />
              <textarea
                name="deliveryAddress"
                required
                minLength={10}
                maxLength={500}
                placeholder="Full delivery address in Bangladesh"
                className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
              <Select name="paymentMethod" defaultValue="CASH_ON_DELIVERY">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH_ON_DELIVERY">
                    Cash on delivery
                  </SelectItem>
                  <SelectItem value="STRIPE">
                    Card payment (after approval)
                  </SelectItem>
                </SelectContent>
              </Select>
              {requiresPrescription && (
                <label className="block space-y-1 text-sm">
                  <span>Prescription document (PDF or image, max 5 MB)</span>
                  <Input
                    name="prescription"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    required
                  />
                </label>
              )}
              <Button
                className="w-full bg-emerald-800 hover:bg-emerald-900"
                disabled={busy}
              >
                {busy ? "Submitting..." : "Place order"}
              </Button>
            </form>
          )}
          {!checkoutOpen && (
            <Button
              className="mt-4 w-full bg-emerald-800 hover:bg-emerald-900"
              disabled={!canOrder || !cart.length}
              onClick={() => setCheckoutOpen(true)}
            >
              Continue to checkout
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
