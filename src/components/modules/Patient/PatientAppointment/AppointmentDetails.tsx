"use client";

import {
  AppointmentStatus,
  IAppointment,
  PaymentStatus,
} from "@/types/appointments.interface";
import { changeAppointmentStatus } from "@/services/patient/appointment.service";
import { initiatePayment } from "@/services/payment/payment.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppointmentDetailsHeader from "./AppointmentDetailsHeader";
import AppointmentFeedbackAlerts from "./AppointmentFeedbackAlerts";
import AppointmentOverview from "./AppointmentOverview";
import AppointmentReviewCard from "./AppointmentReviewCard";
import DoctorInformationCard from "./DoctorInformationCard";
import ReviewDialog from "./ReviewDialog";

interface AppointmentDetailProps {
  appointment: IAppointment;
}

const AppointmentDetails = ({ appointment }: AppointmentDetailProps) => {
  const router = useRouter();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const isCompleted = appointment.status === AppointmentStatus.COMPLETED;
  const isCanceled = appointment.status === AppointmentStatus.CANCELED;
  const isScheduled = appointment.status === AppointmentStatus.SCHEDULED;
  const review = appointment.reviews?.[0];

  const canReview =
    isCompleted &&
    appointment.reviews?.length === 0 &&
    appointment.paymentStatus === PaymentStatus.PAID;
  const canCancel = isScheduled && !isCanceled;

  const handlePayNow = async () => {
    setIsProcessingPayment(true);
    try {
      const result = await initiatePayment(appointment.id);

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment...");
        sessionStorage.setItem(
          "paymentReturnUrl",
          "/dashboard/my-appointments",
        );
        window.location.replace(result.data.paymentUrl);
      } else {
        toast.error(result.message || "Failed to initiate payment");
        setIsProcessingPayment(false);
      }
    } catch (error) {
      toast.error("An error occurred while initiating payment");
      setIsProcessingPayment(false);
      console.error(error);
    }
  };

  const handleCancelAppointment = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setIsCancelling(true);
    try {
      const result = await changeAppointmentStatus(
        appointment.id,
        AppointmentStatus.CANCELED,
      );

      if (result.success) {
        toast.success("Appointment cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to cancel appointment");
      }
    } catch (error) {
      toast.error("An error occurred while cancelling appointment");
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <AppointmentDetailsHeader
        appointment={appointment}
        isCanceled={isCanceled}
        canCancel={canCancel}
        isCancelling={isCancelling}
        onCancel={handleCancelAppointment}
        onBack={() => router.back()}
      />

      <AppointmentFeedbackAlerts
        appointment={appointment}
        isCompleted={isCompleted}
        canReview={canReview}
        isProcessingPayment={isProcessingPayment}
        onReview={() => setShowReviewDialog(true)}
        onPayNow={handlePayNow}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DoctorInformationCard appointment={appointment} />
        <AppointmentOverview appointment={appointment} />
      </div>

      {review && <AppointmentReviewCard review={review} />}

      {canReview && (
        <ReviewDialog
          appointmentId={appointment.id}
          doctorName={appointment.doctor?.name || "the doctor"}
          isOpen={showReviewDialog}
          onClose={() => setShowReviewDialog(false)}
        />
      )}
    </div>
  );
};

export default AppointmentDetails;
