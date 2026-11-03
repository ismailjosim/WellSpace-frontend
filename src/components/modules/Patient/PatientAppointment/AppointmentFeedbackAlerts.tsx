import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IAppointment, PaymentStatus } from "@/types/appointments.interface";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";

interface AppointmentFeedbackAlertsProps {
  appointment: IAppointment;
  isCompleted: boolean;
  canReview: boolean;
  isProcessingPayment: boolean;
  onReview: () => void;
  onPayNow: () => void;
}

const AppointmentFeedbackAlerts = ({
  appointment,
  isCompleted,
  canReview,
  isProcessingPayment,
  onReview,
  onPayNow,
}: AppointmentFeedbackAlertsProps) => (
  <>
    {canReview && (
      <Card className="border-amber-500/30 bg-amber-500/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                Review This Appointment
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your appointment has been completed. Share your experience by
                leaving a review for Dr. {appointment.doctor?.name}.
              </p>
              <Button onClick={onReview} className="mt-3" size="sm">
                Write a Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )}

    {!isCompleted &&
      appointment.reviews?.length === 0 &&
      appointment.paymentStatus === PaymentStatus.UNPAID && (
        <Card className="border-red-500/30 bg-red-500/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  Payment Required to Review
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Please complete the payment for this appointment before
                  leaving a review.
                </p>
                <Button
                  onClick={onPayNow}
                  disabled={isProcessingPayment}
                  className="mt-3 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    {!isCompleted && !appointment.reviews && (
      <Card className="border-blue-500/30 bg-blue-500/10">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                Review Not Available Yet
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You can review this appointment after it has been completed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )}
  </>
);

export default AppointmentFeedbackAlerts;
