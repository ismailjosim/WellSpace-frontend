/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HeartPulse,
  Brain,
  Stethoscope,
  Baby,
  Eye,
  Bone,
  Activity,
  User,
  ArrowUpRight,
  Sparkles,
  Pill,
  ShieldPlus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const iconMap: Record<string, any> = {
  cardiology: HeartPulse,
  neurology: Brain,
  general: Stethoscope,
  "general medicine": Stethoscope,
  pediatrics: Baby,
  ophthalmology: Eye,
  orthopedics: Bone,
  physiotherapy: Activity,
  mental: User,
  "mental health": User,
  dermatology: Sparkles,
  pharmacy: Pill,
  medicine: Pill,
};

interface SpecialtyDisplayItem {
  id: string;
  title: string;
  doctors: string;
  desc: string;
  icon: any;
  iconUrl?: string | null;
}

const defaultSpecialties: SpecialtyDisplayItem[] = [
  {
    id: "1",
    title: "Cardiology",
    doctors: "45+ Doctors",
    desc: "Heart & Vascular Health",
    icon: HeartPulse,
    iconUrl: null,
  },
  {
    id: "2",
    title: "Neurology",
    doctors: "32+ Doctors",
    desc: "Brain & Nervous System",
    icon: Brain,
    iconUrl: null,
  },
  {
    id: "3",
    title: "General Medicine",
    doctors: "80+ Doctors",
    desc: "Primary & Family Care",
    icon: Stethoscope,
    iconUrl: null,
  },
  {
    id: "4",
    title: "Pediatrics",
    doctors: "38+ Doctors",
    desc: "Child & Infant Care",
    icon: Baby,
    iconUrl: null,
  },
  {
    id: "5",
    title: "Ophthalmology",
    doctors: "25+ Doctors",
    desc: "Vision & Eye Care",
    icon: Eye,
    iconUrl: null,
  },
  {
    id: "6",
    title: "Orthopedics",
    doctors: "30+ Doctors",
    desc: "Bones & Joint Health",
    icon: Bone,
    iconUrl: null,
  },
  {
    id: "7",
    title: "Physiotherapy",
    doctors: "28+ Doctors",
    desc: "Rehabilitation & Mobility",
    icon: Activity,
    iconUrl: null,
  },
  {
    id: "8",
    title: "Mental Health",
    doctors: "40+ Doctors",
    desc: "Psychiatry & Therapy",
    icon: User,
    iconUrl: null,
  },
];

interface SpecialistSectionProps {
  specialties?: Array<{
    id: string;
    title: string;
    icon?: string | null;
    _count?: { doctorSpecialties?: number };
  }>;
}

export default function SpecialistsSection({
  specialties = [],
}: SpecialistSectionProps) {
  const displayItems: SpecialtyDisplayItem[] =
    specialties && specialties.length > 0
      ? specialties.map((item, idx) => {
          const lower = item.title.toLowerCase();
          const matchedIcon =
            iconMap[lower] ||
            Object.entries(iconMap).find(([k]) => lower.includes(k))?.[1] ||
            ShieldPlus;

          const docCount = item._count?.doctorSpecialties;
          const doctorsLabel = docCount
            ? `${docCount}+ Doctors`
            : "Verified Specialists";

          return {
            id: item.id || String(idx),
            title: item.title,
            iconUrl:
              item.icon && item.icon.startsWith("http") ? item.icon : null,
            icon: matchedIcon,
            doctors: doctorsLabel,
            desc: `Specialized clinical care & certified practitioners`,
          };
        })
      : defaultSpecialties;

  return (
    <section className="relative py-24 bg-linear-to-b from-background via-accent/30 to-background overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl relative mx-auto px-4 sm:px-6 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
          >
            Clinical Specialties
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Care by{" "}
            <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Specialty
            </span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Connect directly with verified specialists across top medical
            disciplines, available for same-day video appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={`/consultation?specialties=${encodeURIComponent(item.title)}`}
                className="group block"
              >
                <Card className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group-hover:-translate-y-1.5">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 overflow-hidden">
                        {item.iconUrl ? (
                          <Image
                            src={item.iconUrl}
                            alt={item.title}
                            width={28}
                            height={28}
                            className="object-contain"
                          />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>{item.doctors}</span>
                      <span className="text-muted-foreground group-hover:text-primary transition-colors">
                        Book Now →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
