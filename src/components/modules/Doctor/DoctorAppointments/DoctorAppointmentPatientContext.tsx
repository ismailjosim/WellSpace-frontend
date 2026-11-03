import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { IPatient } from "@/types/patient.interface";

interface DoctorAppointmentPatientContextProps {
  patient?: IPatient;
}

const formatEnum = (value?: string | null) =>
  value ? value.replaceAll("_", " ") : "Not provided";

const yesNo = (value?: boolean | null) => (value ? "Yes" : "No");

const getAge = (dateOfBirth?: string) => {
  if (!dateOfBirth) return "Not provided";
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return "Not provided";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return `${age} years`;
};

export default function DoctorAppointmentPatientContext({
  patient,
}: DoctorAppointmentPatientContextProps) {
  const healthData = patient?.patientHealthData;
  const reports = patient?.medicalReport || [];
  const previousPrescriptions = patient?.prescriptions || [];

  return (
    <>
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="font-semibold text-lg mb-3">Patient Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{patient?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{patient?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Contact Number</p>
            <p className="font-medium">
              {patient?.contactNumber || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{patient?.address || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Health Context</h3>
        {!healthData ? (
          <p className="text-sm text-muted-foreground">
            This patient has not added health data yet.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-medium">{getAge(healthData.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Blood Group</p>
                <p className="font-medium">
                  {formatEnum(healthData.bloodGroup)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Height / Weight</p>
                <p className="font-medium">
                  {healthData.height || "-"} cm / {healthData.weight || "-"} kg
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Allergies</p>
                <p className="font-medium">{yesNo(healthData.hasAllergies)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Diabetes</p>
                <p className="font-medium">{yesNo(healthData.hasDiabetes)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Past Surgeries</p>
                <p className="font-medium">
                  {yesNo(healthData.hasPastSurgeries)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Smoking</p>
                <p className="font-medium">{yesNo(healthData.smokingStatus)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recent Anxiety</p>
                <p className="font-medium">{yesNo(healthData.recentAnxiety)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Recent Depression</p>
                <p className="font-medium">
                  {yesNo(healthData.recentDepression)}
                </p>
              </div>
            </div>

            {(healthData.dietaryPreferences ||
              healthData.mentalHealthHistory ||
              healthData.immunizationStatus) && (
              <div className="grid gap-3 text-sm md:grid-cols-3">
                {healthData.dietaryPreferences && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-muted-foreground">Dietary Preferences</p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {healthData.dietaryPreferences}
                    </p>
                  </div>
                )}
                {healthData.mentalHealthHistory && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-muted-foreground">
                      Mental Health History
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {healthData.mentalHealthHistory}
                    </p>
                  </div>
                )}
                {healthData.immunizationStatus && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-muted-foreground">Immunization Status</p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {healthData.immunizationStatus}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Recent Reports</p>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reports uploaded.
              </p>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <a
                    key={report.id}
                    href={report.reportLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm hover:bg-muted"
                  >
                    <span className="truncate">{report.reportName}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Previous Prescriptions</p>
            {previousPrescriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No previous prescriptions.
              </p>
            ) : (
              <div className="space-y-2">
                {previousPrescriptions.map((item) => (
                  <div key={item.id} className="rounded-md border p-2">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium">
                        {item.doctor?.name || "Doctor"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.createdAt), "PP")}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.instructions}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
