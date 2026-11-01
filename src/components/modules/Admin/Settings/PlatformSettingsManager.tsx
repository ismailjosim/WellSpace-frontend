"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ISettingItem,
  updateAdminSettings,
} from "@/services/admin/settings.service";
import {
  Clock,
  DollarSign,
  LifeBuoy,
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface PlatformSettingsManagerProps {
  initialSettings: ISettingItem[];
}

export default function PlatformSettingsManager({
  initialSettings,
}: PlatformSettingsManagerProps) {
  const initialMap = initialSettings.reduce<Record<string, string>>(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {},
  );

  const [formData, setFormData] = useState<Record<string, string>>({
    cancellation_hours_limit: "24",
    min_booking_buffer_minutes: "60",
    platform_commission_percent: "10",
    currency_symbol: "USD",
    support_email: "support@wellspace.health",
    support_phone: "+1 (800) 555-WELL",
    maintenance_mode: "false",
    emergency_notice:
      "For medical emergencies, please immediately visit your nearest emergency room or dial 911.",
    ...initialMap,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await updateAdminSettings(formData);
      if (res.success) {
        toast.success("Platform settings updated successfully");
      } else {
        toast.error(res.message || "Failed to update platform settings");
      }
    } catch {
      toast.error("An unexpected error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const isMaintenanceActive = formData.maintenance_mode === "true";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {isMaintenanceActive && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>
            <strong>MAINTENANCE MODE IS CURRENTLY ACTIVE:</strong> Public
            mutations are blocked with HTTP 503.
          </span>
        </div>
      )}

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted/60">
          <TabsTrigger
            value="appointments"
            className="flex items-center gap-2 py-2 text-xs md:text-sm"
          >
            <Clock className="h-4 w-4" /> Appointments
          </TabsTrigger>
          <TabsTrigger
            value="finance"
            className="flex items-center gap-2 py-2 text-xs md:text-sm"
          >
            <DollarSign className="h-4 w-4" /> Financial
          </TabsTrigger>
          <TabsTrigger
            value="support"
            className="flex items-center gap-2 py-2 text-xs md:text-sm"
          >
            <LifeBuoy className="h-4 w-4" /> Support & Desk
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="flex items-center gap-2 py-2 text-xs md:text-sm"
          >
            <ShieldAlert className="h-4 w-4" /> Governance & Mode
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Appointments */}
        <TabsContent value="appointments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Appointment & Scheduling Policies
              </CardTitle>
              <CardDescription className="text-xs">
                Configure patient booking windows, cancellation time thresholds,
                and slot buffering.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellation_hours_limit">
                    Free Cancellation Window (Hours)
                  </Label>
                  <Input
                    id="cancellation_hours_limit"
                    type="number"
                    min="0"
                    max="168"
                    value={formData.cancellation_hours_limit}
                    onChange={(e) =>
                      handleChange("cancellation_hours_limit", e.target.value)
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Hours before appointment start time within which a patient
                    is permitted to cancel.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_booking_buffer_minutes">
                    Minimum Advance Booking Buffer (Minutes)
                  </Label>
                  <Input
                    id="min_booking_buffer_minutes"
                    type="number"
                    min="15"
                    max="1440"
                    value={formData.min_booking_buffer_minutes}
                    onChange={(e) =>
                      handleChange("min_booking_buffer_minutes", e.target.value)
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Minimum lead time needed before an appointment slot can be
                    reserved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Financial */}
        <TabsContent value="finance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Financial & Revenue Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Manage platform commissions, payment processing currency, and
                payout rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform_commission_percent">
                    Platform Revenue Fee (%)
                  </Label>
                  <Input
                    id="platform_commission_percent"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.platform_commission_percent}
                    onChange={(e) =>
                      handleChange(
                        "platform_commission_percent",
                        e.target.value,
                      )
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Percentage retained by WellSpace from doctor consultation
                    billings.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency_symbol">Billing Currency Code</Label>
                  <Input
                    id="currency_symbol"
                    value={formData.currency_symbol}
                    onChange={(e) =>
                      handleChange(
                        "currency_symbol",
                        e.target.value.toUpperCase(),
                      )
                    }
                    placeholder="USD, EUR, GBP, BDT"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Standard ISO 3-letter currency code printed on patient
                    invoices and receipts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Support & Contact */}
        <TabsContent value="support" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Public Care Helpline & Contact
              </CardTitle>
              <CardDescription className="text-xs">
                Update customer support information displayed across public
                footers and receipts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support_email">Customer Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={formData.support_email}
                    onChange={(e) =>
                      handleChange("support_email", e.target.value)
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Point of contact for appointment billing queries and help
                    requests.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support_phone">24/7 Helpline Telephone</Label>
                  <Input
                    id="support_phone"
                    value={formData.support_phone}
                    onChange={(e) =>
                      handleChange("support_phone", e.target.value)
                    }
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Toll-free emergency triage helpline rendered in patient
                    headers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: System & Security */}
        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                System Operations & Emergency Notice
              </CardTitle>
              <CardDescription className="text-xs">
                Control system maintenance lockouts and mandatory legal medical
                disclaimers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl border">
                  <div>
                    <span className="font-semibold text-sm">
                      System Maintenance Mode
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Restricts database modifications across the platform and
                      alerts all visitors.
                    </p>
                  </div>
                  <select
                    value={formData.maintenance_mode}
                    onChange={(e) =>
                      handleChange("maintenance_mode", e.target.value)
                    }
                    className="h-9 px-3 rounded-md border border-input bg-background text-sm font-medium"
                  >
                    <option value="false">Normal Operations (Disabled)</option>
                    <option value="true">Lockout Mode (Active)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_notice">
                    Mandatory Medical Emergency Notice
                  </Label>
                  <textarea
                    id="emergency_notice"
                    rows={3}
                    value={formData.emergency_notice}
                    onChange={(e) =>
                      handleChange("emergency_notice", e.target.value)
                    }
                    className="w-full rounded-md border border-input bg-background p-3 text-xs leading-relaxed"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Prominently displayed to patients before booking video
                    consultations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-primary" /> Settings changes
          take effect immediately across all nodes
        </span>
        <Button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? "Saving Settings..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
