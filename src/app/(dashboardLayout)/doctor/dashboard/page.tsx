import { getUserInfo } from "@/services/auth/getUserInfo";
import DoctorVerificationAlert from "@/components/modules/Doctor/DoctorVerificationAlert";
import { Stethoscope, Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DoctorDashboardPage() {
  const userInfo = await getUserInfo();
  const doctor = userInfo?.doctor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">
            Doctor Clinical Workspace
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Welcome back, Dr. {doctor?.name || userInfo?.name || "Practitioner"}.
          Manage your appointments, consultation rooms, and schedule slots.
        </p>
      </div>

      {/* Verification State Banner */}
      <DoctorVerificationAlert
        status={doctor?.verificationStatus || "PENDING"}
        rejectionReason={doctor?.rejectionReason}
        licenseDocumentUrl={doctor?.licenseDocumentUrl}
        degreeDocumentUrl={doctor?.degreeDocumentUrl}
      />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Today&apos;s Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Review patients booked for live telemedicine consultations.
            </p>
            <Link href="/doctor/dashboard/my-appointments">
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              My Schedule Pool
            </CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Open and manage available consultation hours for patients.
            </p>
            <Link href="/doctor/dashboard/my-schedules">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Manage Schedules
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Prescriptions & Care
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-3">
              Review issued clinical prescriptions and patient follow-up dates.
            </p>
            <Link href="/doctor/dashboard/my-prescriptions">
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
