import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { IDoctor } from "@/types/doctor.interface";
import { MapPin, Phone, Stethoscope, User } from "lucide-react";

type AppointmentDoctorCardProps = {
  doctor: IDoctor;
};

export default function AppointmentDoctorCard({
  doctor,
}: AppointmentDoctorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" aria-hidden="true" />
          Doctor Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-semibold">{doctor.name}</p>
          <p className="text-muted-foreground">{doctor.designation}</p>
        </div>

        <Separator />

        {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Stethoscope
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-sm font-medium">Specialties</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {doctor.doctorSpecialties.map((specialty, index) => (
                <span
                  key={specialty.specialties?.id ?? index}
                  className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700"
                >
                  {specialty.specialties?.title || "N/A"}
                </span>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          {doctor.qualification && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Qualification:
              </span>
              <span className="text-sm font-medium">
                {doctor.qualification}
              </span>
            </div>
          )}
          {doctor.experience !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Experience:</span>
              <span className="text-sm font-medium">
                {doctor.experience} years
              </span>
            </div>
          )}
          {doctor.currentWorkingPlace && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Working at:</span>
              <span className="text-sm font-medium">
                {doctor.currentWorkingPlace}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          {doctor.contactNumber && (
            <div className="flex items-center gap-2">
              <Phone
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-sm">{doctor.contactNumber}</span>
            </div>
          )}
          {doctor.address && (
            <div className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="text-sm">{doctor.address}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              Consultation Fee
            </span>
            <span className="text-xl font-bold text-blue-600">
              ${doctor.appointmentFee}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
