import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ISchedule } from "@/types/schedule.interface";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
} from "lucide-react";

type AppointmentScheduleCardProps = {
  schedule: ISchedule;
  isPayingNow: boolean;
  isPayingLater: boolean;
  isBooking: boolean;
  onConfirmBooking: () => void;
  onPayLater: () => void;
  onGoBack: () => void;
};

export default function AppointmentScheduleCard({
  schedule,
  isPayingNow,
  isPayingLater,
  isBooking,
  onConfirmBooking,
  onPayLater,
  onGoBack,
}: AppointmentScheduleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" aria-hidden="true" />
          Appointment Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 rounded-lg border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-6">
          <div>
            <p className="mb-1 text-sm text-muted-foreground">Date</p>
            <p className="text-2xl font-bold text-blue-900">
              {format(new Date(schedule.startDateTime), "EEEE")}
            </p>
            <p className="text-lg text-blue-700">
              {format(new Date(schedule.startDateTime), "MMMM d, yyyy")}
            </p>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-lg font-semibold text-blue-900">
                {format(new Date(schedule.startDateTime), "h:mm a")} -{" "}
                {format(new Date(schedule.endDateTime), "h:mm a")}
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-3 pt-4" aria-labelledby="booking-notes">
          <h3 id="booking-notes" className="text-sm font-semibold">
            Important Information
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600" aria-hidden="true">
                •
              </span>
              <span>Please arrive 10 minutes before your scheduled time.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600" aria-hidden="true">
                •
              </span>
              <span>Bring any relevant medical records or prescriptions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600" aria-hidden="true">
                •
              </span>
              <span>
                You can cancel or reschedule from your appointments page.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-600" aria-hidden="true">
                •
              </span>
              <span>A confirmation will be sent to your registered email.</span>
            </li>
          </ul>
        </section>

        <Separator />

        <div className="space-y-3 pt-2">
          <Button
            onClick={onConfirmBooking}
            disabled={isBooking}
            className="w-full"
            size="lg"
          >
            {isPayingNow ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now & Book Appointment
              </>
            )}
          </Button>

          <Button
            onClick={onPayLater}
            disabled={isBooking}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isPayingLater ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Book Now, Pay Later
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={onGoBack}
            disabled={isBooking}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
