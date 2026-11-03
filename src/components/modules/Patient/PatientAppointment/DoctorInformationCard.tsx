import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IAppointment } from "@/types/appointments.interface";
import { MapPin, Phone, Stethoscope, User } from "lucide-react";

interface DoctorInformationCardProps {
  appointment: IAppointment;
}

const DoctorInformationCard = ({ appointment }: DoctorInformationCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="h-5 w-5" />
        Doctor Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-2xl font-semibold">
          {appointment.doctor?.name || "N/A"}
        </p>
        <p className="text-muted-foreground">
          {appointment.doctor?.designation || "Doctor"}
        </p>
      </div>

      <Separator />

      {appointment.doctor?.doctorSpecialties &&
        appointment.doctor.doctorSpecialties.length > 0 && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Specialties</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {appointment.doctor.doctorSpecialties.map((ds, idx) => (
                  <Badge
                    className="bg-primary text-white"
                    key={idx}
                    variant="secondary"
                  >
                    {ds.specialties?.title || "N/A"}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

      <div className="space-y-2">
        {appointment.doctor?.qualification && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Qualification:</span>
            <span className="font-medium">
              {appointment.doctor.qualification}
            </span>
          </div>
        )}

        {appointment.doctor?.experience !== undefined && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Experience:</span>
            <span className="font-medium">
              {appointment.doctor.experience} years
            </span>
          </div>
        )}

        {appointment.doctor?.currentWorkingPlace && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Working at:</span>
            <span className="font-medium">
              {appointment.doctor.currentWorkingPlace}
            </span>
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        {appointment.doctor?.contactNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.doctor.contactNumber}</span>
          </div>
        )}

        {appointment.doctor?.address && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{appointment.doctor.address}</span>
          </div>
        )}
      </div>

      {appointment.doctor?.appointmentFee !== undefined && (
        <>
          <Separator />
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Consultation Fee
              </span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                ${appointment.doctor.appointmentFee}
              </span>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

export default DoctorInformationCard;
