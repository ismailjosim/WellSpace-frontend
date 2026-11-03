"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPrescription } from "@/services/patient/prescription.service";
import { IAppointment } from "@/types/appointments.interface";
import JoinConsultationButton from "@/components/modules/Consultation/JoinConsultationButton";
import { useState } from "react";
import { toast } from "sonner";
import AppointmentChatDialog from "../../Chat/AppointmentChatDialog";
import DoctorAppointmentPatientContext from "./DoctorAppointmentPatientContext";
import DoctorAppointmentPrescriptionSection from "./DoctorAppointmentPrescriptionSection";
import DoctorAppointmentScheduleDetails from "./DoctorAppointmentScheduleDetails";

interface DoctorAppointmentDetailDialogProps {
  appointment: IAppointment | null;
  open: boolean;
  onClose: () => void;
}

export default function DoctorAppointmentDetailDialog({
  appointment,
  open,
  onClose,
}: DoctorAppointmentDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  if (!appointment) return null;

  const handleSubmitPrescription = async () => {
    if (!instructions.trim()) {
      toast.error("Please provide prescription instructions");
      return;
    }

    if (instructions.trim().length < 20) {
      toast.error(
        "Instructions must be at least 20 characters long for clarity",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData: {
        appointmentId: string;
        instructions: string;
        followUpDate?: string;
      } = {
        appointmentId: appointment.id,
        instructions: instructions.trim(),
      };

      if (followUpDate) {
        prescriptionData.followUpDate = new Date(followUpDate).toISOString();
      }

      const result = await createPrescription(prescriptionData);

      if (result.success) {
        toast.success("Prescription created successfully");
        setInstructions("");
        setFollowUpDate("");
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        toast.error(result.message || "Failed to create prescription");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("An error occurred while creating prescription");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInstructions("");
    setFollowUpDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <DoctorAppointmentPatientContext patient={appointment.patient} />
          <DoctorAppointmentScheduleDetails appointment={appointment} />
          <DoctorAppointmentPrescriptionSection
            appointment={appointment}
            instructions={instructions}
            followUpDate={followUpDate}
            isSubmitting={isSubmitting}
            onInstructionsChange={setInstructions}
            onFollowUpDateChange={setFollowUpDate}
            onSubmit={handleSubmitPrescription}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t">
          <div className="flex items-center gap-2">
            <AppointmentChatDialog
              appointmentId={appointment.id}
              counterpartName={appointment.patient?.name || "Patient"}
              role="DOCTOR"
            />
            {appointment.status !== "CANCELED" && (
              <JoinConsultationButton
                appointmentId={appointment.id}
                label="Join Video Room"
              />
            )}
          </div>

          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
