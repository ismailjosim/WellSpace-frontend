"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteMedicalReport,
  updateMyHealthData,
  uploadMedicalReport,
} from "@/services/patient/health-record.service";
import { IPatient, IPatientHealthData } from "@/types/patient.interface";
import { IPrescription } from "@/types/prescription.interface";
import { format } from "date-fns";
import {
  Calendar,
  ExternalLink,
  HeartPulse,
  Loader2,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

interface HealthRecordsClientProps {
  patient: IPatient & { prescriptions?: IPrescription[] };
}

const bloodGroups = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
];

const genderOptions = ["MALE", "FEMALE", "OTHERS"];
const maritalStatusOptions = ["SINGLE", "MARRIED"];

const formatEnum = (value?: string | null) =>
  value ? value.replaceAll("_", " ") : "Not provided";

const yesNo = (value?: boolean | null) => (value ? "Yes" : "No");

const toInputDate = (value?: string) => {
  if (!value) return "";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return parsedDate.toISOString().slice(0, 10);
};

function HealthSnapshot({ healthData }: { healthData?: IPatientHealthData }) {
  const stats = [
    { label: "Blood Group", value: formatEnum(healthData?.bloodGroup) },
    {
      label: "Height / Weight",
      value:
        healthData?.height || healthData?.weight
          ? `${healthData?.height || "-"} cm / ${healthData?.weight || "-"} kg`
          : "Not provided",
    },
    { label: "Allergies", value: yesNo(healthData?.hasAllergies) },
    { label: "Diabetes", value: yesNo(healthData?.hasDiabetes) },
    { label: "Smoking", value: yesNo(healthData?.smokingStatus) },
    { label: "Past Surgeries", value: yesNo(healthData?.hasPastSurgeries) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartPulse className="h-5 w-5 text-primary" />
          Health Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        {healthData?.updatedAt && (
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated {format(new Date(healthData.updatedAt), "PPP")}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function HealthRecordsClient({
  patient,
}: HealthRecordsClientProps) {
  const router = useRouter();
  const [isHealthPending, startHealthTransition] = useTransition();
  const [isReportPending, startReportTransition] = useTransition();
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const healthData = patient.patientHealthData;
  const reports = patient.medicalReport || [];
  const prescriptions = patient.prescriptions || [];

  const handleHealthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      gender: formData.get("gender"),
      dateOfBirth: formData.get("dateOfBirth"),
      bloodGroup: formData.get("bloodGroup"),
      height: formData.get("height"),
      weight: formData.get("weight"),
      maritalStatus: formData.get("maritalStatus"),
      hasAllergies: formData.get("hasAllergies") === "on",
      hasDiabetes: formData.get("hasDiabetes") === "on",
      smokingStatus: formData.get("smokingStatus") === "on",
      pregnancyStatus: formData.get("pregnancyStatus") === "on",
      hasPastSurgeries: formData.get("hasPastSurgeries") === "on",
      recentAnxiety: formData.get("recentAnxiety") === "on",
      recentDepression: formData.get("recentDepression") === "on",
      dietaryPreferences: formData.get("dietaryPreferences") || null,
      mentalHealthHistory: formData.get("mentalHealthHistory") || null,
      immunizationStatus: formData.get("immunizationStatus") || null,
    };

    startHealthTransition(async () => {
      const result = await updateMyHealthData(payload);
      if (result.success) {
        toast.success("Health data updated");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update health data");
      }
    });
  };

  const handleReportSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startReportTransition(async () => {
      const result = await uploadMedicalReport(formData);
      if (result.success) {
        toast.success("Medical report uploaded");
        form.reset();
        router.refresh();
      } else {
        toast.error(result.message || "Failed to upload medical report");
      }
    });
  };

  const handleDeleteReport = (reportId: string) => {
    setDeletingReportId(reportId);
    startReportTransition(async () => {
      const result = await deleteMedicalReport(reportId);
      setDeletingReportId(null);
      if (result.success) {
        toast.success("Medical report deleted");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete report");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
        <p className="mt-2 text-muted-foreground">
          Keep your health profile, reports, and prescription history in one
          place.
        </p>
      </div>

      <HealthSnapshot healthData={healthData} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Health Data</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleHealthSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={healthData?.gender || "MALE"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatEnum(option)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    defaultValue={toInputDate(healthData?.dateOfBirth)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    defaultValue={healthData?.bloodGroup || "O_POSITIVE"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    {bloodGroups.map((option) => (
                      <option key={option} value={option}>
                        {formatEnum(option)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    defaultValue={healthData?.maritalStatus || "SINGLE"}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {maritalStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {formatEnum(option)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    defaultValue={healthData?.height || ""}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    defaultValue={healthData?.weight || ""}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["hasAllergies", "Allergies"],
                  ["hasDiabetes", "Diabetes"],
                  ["smokingStatus", "Smoking"],
                  ["pregnancyStatus", "Pregnancy"],
                  ["hasPastSurgeries", "Past surgeries"],
                  ["recentAnxiety", "Recent anxiety"],
                  ["recentDepression", "Recent depression"],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="flex min-h-10 items-center gap-2 rounded-md border px-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      defaultChecked={Boolean(
                        healthData?.[name as keyof IPatientHealthData],
                      )}
                      className="h-4 w-4"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="dietaryPreferences">
                    Dietary Preferences
                  </Label>
                  <Textarea
                    id="dietaryPreferences"
                    name="dietaryPreferences"
                    defaultValue={healthData?.dietaryPreferences || ""}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mentalHealthHistory">
                    Mental Health History
                  </Label>
                  <Textarea
                    id="mentalHealthHistory"
                    name="mentalHealthHistory"
                    defaultValue={healthData?.mentalHealthHistory || ""}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="immunizationStatus">
                    Immunization Status
                  </Label>
                  <Textarea
                    id="immunizationStatus"
                    name="immunizationStatus"
                    defaultValue={healthData?.immunizationStatus || ""}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isHealthPending}>
                  {isHealthPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Health Data
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Medical Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-3" onSubmit={handleReportSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    name="reportName"
                    placeholder="CBC report, X-ray, MRI..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Report File</Label>
                  <Input id="file" name="file" type="file" required />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isReportPending}
                >
                  {isReportPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload Report
                </Button>
              </form>

              <div className="space-y-3">
                {reports.length === 0 && (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No reports uploaded yet.
                  </div>
                )}
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between gap-3 rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {report.reportName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded {format(new Date(report.createdAt), "PPP")}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={report.reportLink}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                        disabled={deletingReportId === report.id}
                      >
                        {deletingReportId === report.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prescription Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Prescriptions will appear here after completed appointments.
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="relative border-l pl-4"
                    >
                      <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary" />
                      <div className="space-y-2 rounded-md border p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">
                            {prescription.doctor?.name || "Doctor"}
                          </p>
                          <Badge variant="outline">
                            {format(new Date(prescription.createdAt), "PPP")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {prescription.instructions}
                        </p>
                        {prescription.followUpDate && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Calendar className="h-4 w-4" />
                            Follow-up{" "}
                            {format(
                              new Date(prescription.followUpDate),
                              "PPP",
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
