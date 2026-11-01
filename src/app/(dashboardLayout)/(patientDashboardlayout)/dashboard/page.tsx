import { getUserInfo } from "@/services/auth/getUserInfo";
import { getMyFollowUps } from "@/services/prescription/followup.service";
import PatientFollowUpsWidget from "@/components/modules/Patient/FollowUps/PatientFollowUpsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Activity,
  HeartPulse,
  Stethoscope,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default async function PatientDashboardPage() {
  const userInfo = await getUserInfo();
  const followUpsResult = await getMyFollowUps();
  const followUps = followUpsResult?.data || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {userInfo?.name || "Patient"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor your healthcare journey, manage appointments, review
            prescriptions, and maintain continuous care.
          </p>
        </div>

        <Link href="/consultation">
          <Button className="shrink-0 gap-2 shadow-sm">
            <Plus className="h-4 w-4" /> Book New Consultation
          </Button>
        </Link>
      </div>

      {/* Follow-up Tracking & Retention Engine (feat-08) */}
      <PatientFollowUpsWidget followUps={followUps} />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              My Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              View upcoming video visits, payment status, and join consultation
              rooms.
            </p>
            <Link href="/dashboard/my-appointments" className="block">
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Prescriptions (Rx)
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Access digital prescriptions, dosage schedules, and printable
              clinic formats.
            </p>
            <Link href="/dashboard/my-prescriptions" className="block">
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Prescriptions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Medical Reports
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Securely upload and manage diagnostic lab reports and medical
              imaging.
            </p>
            <Link href="/dashboard/my-reports" className="block">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Medical Records
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Find Doctors
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Filter verified physicians by specialty, consultation fee, rating,
              and availability.
            </p>
            <Link href="/consultation" className="block">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Browse Doctors
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
