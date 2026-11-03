import { Button } from "@/components/ui/button";
import { IAppointment } from "@/types/appointments.interface";
import AppointmentChatDialog from "@/components/modules/Chat/AppointmentChatDialog";
import JoinConsultationButton from "@/components/modules/Consultation/JoinConsultationButton";
import { Loader2 } from "lucide-react";

interface AppointmentDetailsHeaderProps {
  appointment: IAppointment;
  isCanceled: boolean;
  canCancel: boolean;
  isCancelling: boolean;
  onCancel: () => void;
  onBack: () => void;
}

const AppointmentDetailsHeader = ({
  appointment,
  isCanceled,
  canCancel,
  isCancelling,
  onCancel,
  onBack,
}: AppointmentDetailsHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Appointment Details</h1>
      <p className="text-muted-foreground mt-2">
        Complete information about your appointment
      </p>
    </div>
    <div className="flex flex-wrap gap-2 items-center">
      <AppointmentChatDialog
        appointmentId={appointment.id}
        counterpartName={appointment.doctor?.name || "Doctor"}
        role="PATIENT"
      />

      {!isCanceled && (
        <JoinConsultationButton
          appointmentId={appointment.id}
          label="Join Video Call"
        />
      )}

      {canCancel && (
        <Button
          variant="destructive"
          size="sm"
          onClick={onCancel}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Cancel"
          )}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={onBack}>
        Back
      </Button>
    </div>
  </div>
);

export default AppointmentDetailsHeader;
