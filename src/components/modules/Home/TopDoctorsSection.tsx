/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Video, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const defaultTopDoctors = [
  {
    id: "default-1",
    name: "Dr. Alistair Chen",
    specialization: "Cardiology Specialist",
    rating: 4.9,
    reviews: 128,
    experience: "14 yrs exp",
    fee: "$75",
    initials: "AC",
    profilePhoto: null,
    link: "/consultation",
  },
  {
    id: "default-2",
    name: "Dr. Evelyn Sharma",
    specialization: "Dermatology & Laser",
    rating: 4.8,
    reviews: 154,
    experience: "11 yrs exp",
    fee: "$65",
    initials: "ES",
    profilePhoto: null,
    link: "/consultation",
  },
  {
    id: "default-3",
    name: "Dr. Javier Morales",
    specialization: "Internal Medicine",
    rating: 5.0,
    reviews: 210,
    experience: "16 yrs exp",
    fee: "$80",
    initials: "JM",
    profilePhoto: null,
    link: "/consultation",
  },
  {
    id: "default-4",
    name: "Dr. Sophia Lee",
    specialization: "Pediatrics & Neonatal",
    rating: 4.9,
    reviews: 95,
    experience: "9 yrs exp",
    fee: "$60",
    initials: "SL",
    profilePhoto: null,
    link: "/consultation",
  },
];

interface TopDoctorsSectionProps {
  doctors?: any[];
}

export default function TopDoctorsSection({
  doctors = [],
}: TopDoctorsSectionProps) {
  const displayDoctors =
    doctors && doctors.length > 0
      ? doctors.slice(0, 4).map((doc, idx) => {
          const name = doc.name.startsWith("Dr.")
            ? doc.name
            : `Dr. ${doc.name}`;
          const initials =
            doc.name
              .replace(/^(Dr\.|Doctor)\s*/i, "")
              .split(" ")
              .filter(Boolean)
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "DR";

          const specialty =
            doc.doctorSpecialties?.[0]?.specialties?.title ||
            doc.designation ||
            doc.qualification ||
            "Clinical Specialist";

          return {
            id: doc.id || `doc-${idx}`,
            name,
            specialization: specialty,
            rating: Number(doc.averageRating || 4.9).toFixed(1),
            reviews: doc.reviewCount || doc._count?.reviews || 85 + idx * 15,
            experience: `${doc.experience || 8} yrs exp`,
            fee: `$${doc.appointmentFee || 60}`,
            initials,
            profilePhoto:
              doc.profilePhoto && doc.profilePhoto.startsWith("http")
                ? doc.profilePhoto
                : null,
            link: doc.id ? `/consultation/doctor/${doc.id}` : "/consultation",
          };
        })
      : defaultTopDoctors;

  return (
    <section className="py-24 bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4 max-w-xl">
            <Badge
              variant="outline"
              className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
            >
              Certified Specialists
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Meet Our{" "}
              <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                Top Doctors
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Consult with board-certified practitioners who consistently
              receive outstanding patient satisfaction ratings.
            </p>
          </div>

          <Link href="/consultation">
            <Button
              variant="outline"
              className="rounded-full px-6 py-5 border-border/80 hover:bg-accent hover:border-primary/40 font-medium group transition-all"
            >
              <span>View All 500+ Doctors</span>
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
                {/* Top Avatar & Availability */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    {doctor.profilePhoto ? (
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-primary/20 relative shadow-sm">
                        <Image
                          src={doctor.profilePhoto}
                          alt={doctor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 via-accent to-primary/5 border border-primary/20 text-primary font-bold text-lg shadow-sm">
                        {doctor.initials}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                    <Video className="w-3 h-3" />
                    <span>HD Video</span>
                  </span>
                </div>

                {/* Doctor Bio */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-medium text-primary line-clamp-1">
                    {doctor.specialization}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span>{doctor.experience}</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">
                      {doctor.fee}
                    </span>
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-border/40">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(Number(doctor.rating))
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-foreground ml-1">
                    {doctor.rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({doctor.reviews})
                  </span>
                </div>

                {/* Action CTA */}
                <Link href={doctor.link} className="block w-full pt-1">
                  <Button className="w-full rounded-xl py-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-xs">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    Book Consult
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
