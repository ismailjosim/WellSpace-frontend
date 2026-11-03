"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  createAppointment,
  createAppointmentWithPayLater,
} from "@/services/patient/appointment.service";
import type { IDoctor } from "@/types/doctor.interface";
import type { ISchedule } from "@/types/schedule.interface";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppointmentDoctorCard from "./AppointmentDoctorCard";
import AppointmentScheduleCard from "./AppointmentScheduleCard";

interface AppointmentConfirmationProps {
  doctor: IDoctor;
  schedule: ISchedule;
}

const AppointmentConfirmation = ({
  doctor,
  schedule,
}: AppointmentConfirmationProps) => {
  const router = useRouter();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isPayingNow, setIsPayingNow] = useState(false);
  const [isPayingLater, setIsPayingLater] = useState(false);
  const isBooking = isPayingNow || isPayingLater;

  const handleConfirmBooking = async () => {
    setIsPayingNow(true);

    try {
      const result = await createAppointment({
        doctorId: doctor.id!,
        scheduleId: schedule.id,
      });

      if (result.success && result.data?.paymentUrl) {
        toast.success("Redirecting to payment...");
        window.location.replace(result.data.paymentUrl);
        return;
      }

      if (result.success) {
        setBookingSuccess(true);
        toast.success("Appointment booked successfully!");
        setTimeout(() => router.push("/dashboard/my-appointments"), 2000);
        return;
      }

      toast.error(result.message || "Failed to book appointment");
      setIsPayingNow(false);
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
      setIsPayingNow(false);
      console.error(error);
    }
  };

  const handlePayLater = async () => {
    setIsPayingLater(true);

    try {
      const result = await createAppointmentWithPayLater({
        doctorId: doctor.id!,
        scheduleId: schedule.id,
      });

      if (result.success) {
        setBookingSuccess(true);
        toast.success(
          "Appointment booked! You can pay later from your appointments page.",
        );
        setTimeout(() => router.push("/dashboard/my-appointments"), 2000);
        return;
      }

      toast.error(result.message || "Failed to book appointment");
      setIsPayingLater(false);
    } catch (error) {
      toast.error("An error occurred while booking the appointment");
      setIsPayingLater(false);
      console.error(error);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="space-y-4 text-center" role="status">
              <CheckCircle2
                className="mx-auto h-16 w-16 text-green-600"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-2xl font-bold text-green-900">
                  Appointment Confirmed!
                </h2>
                <p className="mt-2 text-green-700">
                  Your appointment has been successfully booked
                </p>
              </div>
              <p className="text-sm text-green-600">
                Redirecting to your appointments...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Confirm Appointment
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review the details below and confirm your appointment
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <AppointmentDoctorCard doctor={doctor} />
        <AppointmentScheduleCard
          schedule={schedule}
          isPayingNow={isPayingNow}
          isPayingLater={isPayingLater}
          isBooking={isBooking}
          onConfirmBooking={handleConfirmBooking}
          onPayLater={handlePayLater}
          onGoBack={() => router.back()}
        />
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
