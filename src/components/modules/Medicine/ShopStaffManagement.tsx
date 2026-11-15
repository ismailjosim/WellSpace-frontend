"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
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
import { createShopStaff } from "@/services/medicine/medicine.service";

type Staff = {
  id: string;
  email: string;
  role: "SHOP_MANAGER" | "SHOP_ASSISTANT";
  status: string;
  createdAt: string;
  shopStaff?: { name: string; contactNumber: string };
};

export default function ShopStaffManagement({ staff }: { staff: Staff[] }) {
  const router = useRouter();
  const [role, setRole] = useState<Staff["role"]>("SHOP_MANAGER");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (formData: FormData) => {
    setBusy(true);
    setMessage("");
    const result = await createShopStaff({
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      contactNumber: String(formData.get("contactNumber") || ""),
      password: String(formData.get("password") || ""),
      role,
    });
    setBusy(false);
    setMessage(
      result.message ||
        (result.success
          ? "Staff account created."
          : "Unable to create account."),
    );
    if (result.success) {
      (
        document.getElementById("staff-form") as HTMLFormElement | null
      )?.reset();
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-emerald-700">
          Access management
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Shop staff</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create manager and assistant accounts for pharmacy operations.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="size-5" /> Add shop staff
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="staff-form"
            action={submit}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <Input name="name" required minLength={1} placeholder="Full name" />
            <Input
              name="email"
              required
              type="email"
              placeholder="Email address"
            />
            <Input name="contactNumber" required placeholder="Contact number" />
            <Input
              name="password"
              required
              minLength={8}
              type="password"
              placeholder="Temporary password (8+ characters)"
            />
            <Select
              value={role}
              onValueChange={(value) => {
                if (value === "SHOP_MANAGER" || value === "SHOP_ASSISTANT")
                  setRole(value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHOP_MANAGER">Shop Manager</SelectItem>
                <SelectItem value="SHOP_ASSISTANT">Shop Assistant</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2">
              <Button
                className="bg-emerald-800 hover:bg-emerald-900"
                disabled={busy}
              >
                {busy ? "Creating..." : "Create account"}
              </Button>
              {message && (
                <p role="status" className="text-sm text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Staff accounts ({staff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {staff.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">
                        {member.shopStaff?.name || "—"}
                      </td>
                      <td className="py-3">{member.email}</td>
                      <td className="py-3">
                        {member.role === "SHOP_MANAGER"
                          ? "Manager"
                          : "Assistant"}
                      </td>
                      <td className="py-3">{member.status}</td>
                      <td className="py-3">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No shop staff accounts yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
