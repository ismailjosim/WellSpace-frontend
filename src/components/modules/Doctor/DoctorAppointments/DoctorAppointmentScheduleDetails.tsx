import { Badge } from "@/components/ui/badge";
import { IAppointment } from "@/types/appointments.interface";
import { format } from "date-fns";
import AppointmentCountdown from "../../Patient/PatientAppointment/AppointmentCountdown";

interface DoctorAppointmentScheduleDetailsProps {
  appointment: IAppointment;
}

export default function DoctorAppointmentScheduleDetails({
  appointment,
}: DoctorAppointmentScheduleDetailsProps) {
  const { schedule, status, paymentStatus } = appointment;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Appointment Details</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Schedule Date</p>
          <p className="font-medium">
            {schedule?.startDateTime
              ? format(new Date(schedule.startDateTime), "PPP")
              : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Time</p>
          <p className="font-medium">
            {schedule?.startDateTime && schedule?.endDateTime
              ? `${format(new Date(schedule.startDateTime), "p")} - ${format(
                  new Date(schedule.endDateTime),
                  "p",
                )}`
              : "N/A"}
          </p>
        </div>
        {status === "SCHEDULED" && schedule?.startDateTime && (
          <div className="col-span-2 pt-2 border-t">
            <p className="text-muted-foreground mb-2">Time Until Appointment</p>
            <AppointmentCountdown
              appointmentDateTime={schedule.startDateTime}
            />
          </div>
        )}
        <div>
          <p className="text-muted-foreground">Status</p>
          <div>
            <Badge
              variant="outline"
              className={
                status === "COMPLETED"
                  ? "border-green-500 text-green-700 bg-green-50"
                  : status === "INPROGRESS"
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : status === "SCHEDULED"
                      ? "border-purple-500 text-purple-700 bg-purple-50"
                      : "border-red-500 text-red-700 bg-red-50"
              }
            >
              {status}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">Payment</p>
          <div>
            <Badge
              variant={paymentStatus === "PAID" ? "default" : "destructive"}
            >
              {paymentStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
