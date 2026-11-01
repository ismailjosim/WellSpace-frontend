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
} from "lucide-react";
import Link from "next/link";

const specialists = [
  { id: 1, name: "Cardiology", icon: HeartPulse, doctors: "45+ Doctors", desc: "Heart & Vascular Health" },
  { id: 2, name: "Neurology", icon: Brain, doctors: "32+ Doctors", desc: "Brain & Nervous System" },
  { id: 3, name: "General Medicine", icon: Stethoscope, doctors: "80+ Doctors", desc: "Primary & Family Care" },
  { id: 4, name: "Pediatrics", icon: Baby, doctors: "38+ Doctors", desc: "Child & Infant Care" },
  { id: 5, name: "Ophthalmology", icon: Eye, doctors: "25+ Doctors", desc: "Vision & Eye Care" },
  { id: 6, name: "Orthopedics", icon: Bone, doctors: "30+ Doctors", desc: "Bones & Joint Health" },
  { id: 7, name: "Physiotherapy", icon: Activity, doctors: "28+ Doctors", desc: "Rehabilitation & Mobility" },
  { id: 8, name: "Mental Health", icon: User, doctors: "40+ Doctors", desc: "Psychiatry & Therapy" },
];

export default function SpecialistsSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-background via-accent/30 to-background overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl relative mx-auto px-4 sm:px-6 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
          >
            Clinical Specialties
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Care by <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Specialty</span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Connect directly with verified specialists across top medical disciplines, available for same-day video appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialists.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={`/consultation`} className="group block">
                <Card className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group-hover:-translate-y-1.5">
                  <CardContent className="p-6 flex flex-col justify-between h-full space-y-5">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
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
