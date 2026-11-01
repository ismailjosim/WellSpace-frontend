"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { IDoctor } from "@/types/doctor.interface";
import { Clock, DollarSign, Eye, MapPin, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BookAppointmentDialog from "./BookAppointmentDialog";
import { getInitials } from "../../../lib/formatters.ts";

interface DoctorCardProps {
  doctor: IDoctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  return (
    <>
      <Card className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shadow-xs">
              <AvatarImage src={doctor.profilePhoto || ""} alt={doctor.name} />
              <AvatarFallback className="rounded-2xl text-base font-bold bg-primary/10 text-primary">
                {getInitials(doctor.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
                Dr. {doctor.name}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {doctor.designation}
              </CardDescription>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-foreground">
                    {doctor.averageRating ? doctor.averageRating.toFixed(1) : "New"}
                  </span>
                </div>
                {doctor.doctorSpecialties &&
                  doctor.doctorSpecialties.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20 text-[11px] font-semibold"
                    >
                      {doctor.doctorSpecialties[0].specialties?.title}
                    </Badge>
                  )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{doctor.experience} years exp</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-bold text-foreground">
                ${doctor.appointmentFee}
              </span>
            </div>
          </div>

          {doctor.currentWorkingPlace && (
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="line-clamp-1">{doctor.currentWorkingPlace}</span>
            </div>
          )}

          {doctor.qualification && (
            <div className="text-xs">
              <span className="text-muted-foreground">Degree: </span>
              <span className="font-medium text-foreground line-clamp-1">
                {doctor.qualification}
              </span>
            </div>
          )}

          {doctor.doctorSpecialties && doctor.doctorSpecialties.length > 1 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {doctor.doctorSpecialties.slice(1, 3).map((specialty) => (
                <Badge
                  key={specialty?.specialtiesId}
                  variant="outline"
                  className="text-[10px] py-0 border-border/80"
                >
                  {specialty.specialties?.title}
                </Badge>
              ))}
              {doctor.doctorSpecialties.length > 3 && (
                <Badge variant="outline" className="text-[10px] py-0 border-border/80">
                  +{doctor.doctorSpecialties.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t border-border/50 flex gap-2">
          <Link className="flex-1" href={`/consultation/doctor/${doctor.id}`}>
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-medium">
              <Eye className="h-3.5 w-3.5 mr-1" />
              Profile
            </Button>
          </Link>
          <Button
            onClick={() => setShowScheduleModal(true)}
            size="sm"
            className="flex-1 rounded-xl text-xs font-semibold shadow-xs"
          >
            <Calendar className="h-3.5 w-3.5 mr-1" />
            Book Slot
          </Button>
        </CardFooter>
      </Card>

      <BookAppointmentDialog
        doctor={doctor}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </>
  );
}
