import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IAppointment } from "@/types/appointments.interface";
import { format } from "date-fns";

interface DoctorAppointmentPrescriptionSectionProps {
  appointment: IAppointment;
  instructions: string;
  followUpDate: string;
  isSubmitting: boolean;
  onInstructionsChange: (value: string) => void;
  onFollowUpDateChange: (value: string) => void;
  onSubmit: () => void;
}

export default function DoctorAppointmentPrescriptionSection({
  appointment,
  instructions,
  followUpDate,
  isSubmitting,
  onInstructionsChange,
  onFollowUpDateChange,
  onSubmit,
}: DoctorAppointmentPrescriptionSectionProps) {
  const { status, prescription } = appointment;
  const isCompleted = status === "COMPLETED";
  const hasPrescription = !!prescription;
  const canWritePrescription = isCompleted && !hasPrescription;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-3">Prescription</h3>

      {status === "CANCELED" && (
        <div className="text-sm text-muted-foreground p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">
            ⚠️ This appointment has been canceled. No prescription can be
            provided.
          </p>
        </div>
      )}

      {!isCompleted && status !== "CANCELED" && (
        <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
          <p>
            You can write a prescription once the appointment is marked as{" "}
            <span className="font-semibold text-green-700">COMPLETED</span>.
          </p>
        </div>
      )}

      {canWritePrescription && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
            <p className="text-sm text-amber-800">
              ⚠️ Once created, prescriptions cannot be edited or deleted. Please
              ensure all information is correct.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              Instructions <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="instructions"
              placeholder="Enter prescription instructions (minimum 20 characters)..."
              value={instructions}
              onChange={(event) => onInstructionsChange(event.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {instructions.length} / 20 characters minimum
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpDate">
              Follow-up Date & Time (Optional)
            </Label>
            <Input
              id="followUpDate"
              type="datetime-local"
              value={followUpDate}
              onChange={(event) => onFollowUpDateChange(event.target.value)}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <Button onClick={onSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Prescription..." : "Create Prescription"}
          </Button>
        </div>
      )}

      {hasPrescription && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-800">
              ✓ Prescription has been provided for this appointment
            </p>
            <p className="text-xs text-green-700 mt-1">
              Note: Appointment status cannot be changed once prescription is
              provided
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Instructions</p>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">
                  {prescription.instructions}
                </p>
              </div>
            </div>

            {prescription.followUpDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Follow-up Date
                </p>
                <p className="text-sm font-medium">
                  {format(new Date(prescription.followUpDate), "PPP")}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground italic pt-2 border-t">
              Note: Prescriptions cannot be edited or deleted once created
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
