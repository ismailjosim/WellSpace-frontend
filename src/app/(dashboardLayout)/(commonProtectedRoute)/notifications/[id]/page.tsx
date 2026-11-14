import { getSingleNotification } from "@/services/notification/notification.server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Clock,
  ArrowLeft,
  Stethoscope,
  ExternalLink,
  CreditCard,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotificationDetailPage({
  params,
}: NotificationDetailPageProps) {
  const { id } = await params;
  const result = await getSingleNotification(id);

  if (!result?.success || !result?.data) {
    notFound();
  }

  const notification = result.data;
  const appointment = notification.appointment;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "APPOINTMENT_BOOKED":
      case "APPOINTMENT_STATUS_UPDATED":
        return <Calendar className="h-6 w-6 text-primary" />;
      case "PAYMENT_COMPLETED":
        return <CreditCard className="h-6 w-6 text-emerald-500" />;
      case "PRESCRIPTION_CREATED":
        return <FileText className="h-6 w-6 text-blue-500" />;
      default:
        return <Bell className="h-6 w-6 text-primary" />;
    }
  };

  const getDeepLink = () => {
    if (notification.appointmentId) {
      return `/dashboard/my-appointments/${notification.appointmentId}`;
    }
    return "/dashboard";
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
      {/* Back button & header */}
      <div className="flex items-center justify-between">
        <Link href="/notifications">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to All Notifications
          </Button>
        </Link>
        <Badge
          variant={notification.isRead ? "secondary" : "default"}
          className="px-3 py-1"
        >
          {notification.isRead ? "Read" : "Unread"}
        </Badge>
      </div>

      {/* Main Notification Card */}
      <Card className="border shadow-md">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              {getTypeIcon(notification.type)}
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs font-semibold uppercase tracking-wider"
                >
                  {notification.type.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(notification.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                {notification.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Notification Message Text */}
          <div className="rounded-xl border bg-muted/30 p-5 text-base leading-relaxed text-foreground">
            {notification.message}
          </div>

          {/* Related Appointment Context Box */}
          {appointment && (
            <div className="rounded-2xl border p-5 bg-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Associated Consultation Context
                </h3>
                <Badge variant="outline" className="text-xs">
                  Status: {appointment.status || "CONFIRMED"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {appointment.doctor && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {appointment.doctor.name?.[0] || "D"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Dr. {appointment.doctor.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.doctor.designation || "Specialist"}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.schedule && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/50">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Scheduled Date & Time
                      </p>
                      <p className="font-medium text-foreground">
                        {new Date(
                          appointment.schedule.startDateTime,
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {new Date(
                          appointment.schedule.startDateTime,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {notification.appointmentId && (
                <div className="pt-2 flex justify-end">
                  <Link href={getDeepLink()}>
                    <Button className="gap-2">
                      <span>View Appointment Details</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Fallback Action when no appointment but deep link possible */}
          {!appointment && notification.appointmentId && (
            <div className="flex justify-end pt-2">
              <Link href={getDeepLink()}>
                <Button className="gap-2">
                  <span>View Appointment</span>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
