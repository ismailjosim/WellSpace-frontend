import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AppointmentStatus,
  IAppointment,
} from "@/types/appointments.interface";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import AppointmentCountdown from "./AppointmentCountdown";

interface AppointmentOverviewProps {
  appointment: IAppointment;
}

const AppointmentStatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const statusConfig: Record<
    AppointmentStatus,
    {
      variant: "default" | "secondary" | "destructive";
      label: string;
      className?: string;
    }
  > = {
    [AppointmentStatus.SCHEDULED]: {
      variant: "default",
      label: "Scheduled",
      className: "bg-blue-500 hover:bg-blue-600",
    },
    [AppointmentStatus.INPROGRESS]: {
      variant: "secondary",
      label: "In Progress",
    },
    [AppointmentStatus.COMPLETED]: {
      variant: "default",
      label: "Completed",
      className: "bg-green-500 hover:bg-green-600",
    },
    [AppointmentStatus.CANCELED]: {
      variant: "destructive",
      label: "Canceled",
    },
  };
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const AppointmentOverview = ({ appointment }: AppointmentOverviewProps) => (
  <div className="space-y-6 lg:col-span-1">
    <Card>
      <CardHeader>
        <CardTitle>Appointment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Current Status</span>
          <AppointmentStatusBadge status={appointment.status} />
        </div>
      </CardContent>
    </Card>

    {appointment.schedule && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-linear-to-br from-blue-500/10 to-primary/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-200">
                {format(new Date(appointment.schedule.startDateTime), "EEEE")}
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                {format(
                  new Date(appointment.schedule.startDateTime),
                  "MMMM d, yyyy",
                )}
              </p>
            </div>

            <Separator className="bg-blue-500/30" />

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold text-blue-900 dark:text-blue-200">
                  {format(
                    new Date(appointment.schedule.startDateTime),
                    "h:mm a",
                  )}{" "}
                  -{" "}
                  {format(new Date(appointment.schedule.endDateTime), "h:mm a")}
                </p>
              </div>
            </div>

            {appointment.status === AppointmentStatus.SCHEDULED &&
              appointment.schedule.startDateTime && (
                <>
                  <Separator className="bg-blue-500/30" />
                  <div className="pt-2">
                    <AppointmentCountdown
                      appointmentDateTime={appointment.schedule.startDateTime}
                      className="text-blue-700 dark:text-blue-300"
                    />
                  </div>
                </>
              )}
          </div>
        </CardContent>
      </Card>
    )}

    {appointment.prescription && (
      <Card className="border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            Prescription Available
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-green-500/10 rounded-lg p-3 space-y-2">
            <div>
              <span className="text-sm font-medium text-green-900 dark:text-green-200">
                Instructions:
              </span>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {appointment.prescription.instructions}
              </p>
            </div>

            {appointment.prescription.followUpDate && (
              <div>
                <span className="text-sm font-medium text-green-900 dark:text-green-200">
                  Follow-up Date:
                </span>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {format(
                    new Date(appointment.prescription.followUpDate),
                    "MMMM d, yyyy",
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
);

export default AppointmentOverview;
