"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackagePlus, Pencil, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  deactivateMedicine,
  createMedicine,
  updateMedicine,
  updateMedicineStock,
} from "@/services/medicine/medicine.service";

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
  price: string | number;
  stock: number;
  imageUrl?: string | null;
  requiresPrescription: boolean;
  isActive: boolean;
};

const fields = [
  ["name", "Medicine name", "text"],
  ["genericName", "Generic name", "text"],
  ["brand", "Brand", "text"],
  ["category", "Category", "text"],
  ["dosageForm", "Dosage form (tablet, syrup…)", "text"],
  ["strength", "Strength", "text"],
  ["manufacturer", "Manufacturer", "text"],
  ["price", "Price (BDT)", "number"],
  ["stock", "Initial stock", "number"],
] as const;

export default function ShopInventory({
  medicines,
  manager,
}: {
  medicines: Medicine[];
  manager: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);

  const addProduct = async (formData: FormData) => {
    setBusy("create");
    setMessage("");
    const data = Object.fromEntries(formData.entries());
    const requiresPrescription = formData.get("requiresPrescription") === "on";
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      requiresPrescription,
      description: String(data.description || ""),
    };
    const request = new FormData();
    request.set("data", JSON.stringify(payload));
    const image = formData.get("file");
    if (image instanceof File && image.size) request.set("file", image);
    const result = await createMedicine(request);
    setBusy("");
    setMessage(
      result.message ||
        (result.success ? "Medicine added." : "Unable to add medicine."),
    );
    if (result.success) {
      (
        document.getElementById(
          "medicine-create-form",
        ) as HTMLFormElement | null
      )?.reset();
      router.refresh();
    }
  };

  const saveStock = async (id: string, formData: FormData) => {
    setBusy(id);
    const result = await updateMedicineStock(id, Number(formData.get("stock")));
    setBusy("");
    setMessage(
      result.message ||
        (result.success ? "Stock updated." : "Unable to update stock."),
    );
    if (result.success) router.refresh();
  };

  const saveMedicine = async (id: string, formData: FormData) => {
    setBusy(id);
    setMessage("");
    const data = Object.fromEntries(formData.entries());
    const request = new FormData();
    request.set(
      "data",
      JSON.stringify({
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        requiresPrescription: formData.get("requiresPrescription") === "on",
      }),
    );
    const image = formData.get("file");
    if (image instanceof File && image.size) request.set("file", image);
    const result = await updateMedicine(id, request);
    setBusy("");
    setMessage(
      result.message ||
        (result.success ? "Medicine updated." : "Unable to update medicine."),
    );
    if (result.success) {
      setEditing(null);
      router.refresh();
    }
  };

  const archive = async (id: string) => {
    setBusy(id);
    const result = await deactivateMedicine(id);
    setBusy("");
    setMessage(
      result.message ||
        (result.success ? "Medicine removed." : "Unable to remove medicine."),
    );
    if (result.success) router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Pharmacy operations
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Medicine catalog
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage products, prescription requirements and available stock.
        </p>
      </div>
      {manager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PackagePlus className="size-5" /> Add a medicine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="medicine-create-form"
              action={addProduct}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {fields.map(([name, label, type]) => (
                <Input
                  key={name}
                  name={name}
                  type={type}
                  required
                  placeholder={label}
                  min={type === "number" ? "0" : undefined}
                  step={name === "price" ? "0.01" : undefined}
                />
              ))}
              <Input
                name="description"
                required
                minLength={5}
                placeholder="Product description"
              />
              <label className="flex items-center gap-2 rounded-md border px-3 text-sm">
                <input
                  type="checkbox"
                  name="requiresPrescription"
                  className="size-4 accent-emerald-800"
                />
                Prescription required
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Product photo <Input name="file" type="file" accept="image/*" />
              </label>
              <div className="flex items-center gap-3">
                <Button
                  className="bg-emerald-800 hover:bg-emerald-900"
                  disabled={busy === "create"}
                >
                  {busy === "create" ? "Saving…" : "Add product"}
                </Button>
                {message && (
                  <span role="status" className="text-sm text-muted-foreground">
                    {message}
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      {!manager && message && (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Inventory ({medicines.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medicines.length ? (
            medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="flex flex-col gap-4 rounded-xl border p-4 md:flex-row md:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950">
                    {medicine.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={medicine.imageUrl}
                        alt=""
                        className="size-10 object-contain"
                      />
                    ) : (
                      <PackagePlus className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {medicine.name}{" "}
                      <span className="font-normal text-muted-foreground">
                        · {medicine.strength}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {medicine.brand} · ৳{Number(medicine.price).toFixed(2)}
                    </p>
                    <div className="mt-1 flex gap-2">
                      <Badge
                        variant={medicine.isActive ? "secondary" : "outline"}
                      >
                        {medicine.isActive ? "Active" : "Archived"}
                      </Badge>
                      {medicine.requiresPrescription && (
                        <Badge variant="outline">Rx</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <form
                  action={(formData) => saveStock(medicine.id, formData)}
                  className="flex items-center gap-2"
                >
                  <label
                    className="text-sm text-muted-foreground"
                    htmlFor={`stock-${medicine.id}`}
                  >
                    Stock
                  </label>
                  <Input
                    id={`stock-${medicine.id}`}
                    name="stock"
                    type="number"
                    min="0"
                    required
                    defaultValue={medicine.stock}
                    className="w-24"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label="Save stock"
                    disabled={busy === medicine.id}
                  >
                    <Save className="size-4" />
                  </Button>
                </form>
                {manager && medicine.isActive && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditing(editing === medicine.id ? null : medicine.id)
                      }
                    >
                      <Pencil className="mr-2 size-4" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => archive(medicine.id)}
                      disabled={busy === medicine.id}
                    >
                      <Trash2 className="mr-2 size-4" /> Archive
                    </Button>
                  </div>
                )}
                {manager && editing === medicine.id && (
                  <form
                    action={(formData) => saveMedicine(medicine.id, formData)}
                    className="grid w-full gap-2 rounded-lg bg-muted/40 p-3 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {fields.map(([name, label, type]) => (
                      <Input
                        key={name}
                        name={name}
                        type={type}
                        required
                        defaultValue={medicine[name]}
                        placeholder={label}
                        min={type === "number" ? "0" : undefined}
                        step={name === "price" ? "0.01" : undefined}
                      />
                    ))}
                    <Input
                      name="description"
                      required
                      minLength={5}
                      defaultValue={medicine.description}
                      placeholder="Product description"
                    />
                    <label className="flex items-center gap-2 rounded-md border px-3 text-sm">
                      <input
                        type="checkbox"
                        name="requiresPrescription"
                        defaultChecked={medicine.requiresPrescription}
                        className="size-4 accent-emerald-800"
                      />
                      Prescription required
                    </label>
                    <label className="flex items-center gap-2 text-sm text-muted-foreground">
                      Replace photo{" "}
                      <Input name="file" type="file" accept="image/*" />
                    </label>
                    <Button
                      className="bg-emerald-800 hover:bg-emerald-900"
                      disabled={busy === medicine.id}
                    >
                      {busy === medicine.id ? "Saving…" : "Save changes"}
                    </Button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No products in the catalog yet. A manager can add the first
              medicine.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
