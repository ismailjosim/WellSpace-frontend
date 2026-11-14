"use client";

import { Users, Video, Star, Clock } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Verified Doctors",
    sublabel: "Across 45+ medical specialties",
  },
  {
    icon: Video,
    value: "120k+",
    label: "Consultations Done",
    sublabel: "Over 99.9% video call uptime",
  },
  {
    icon: Star,
    value: "98.7%",
    label: "Patient Satisfaction",
    sublabel: "Rated 4.8/5 on average",
  },
  {
    icon: Clock,
    value: "< 15 Min",
    label: "Fast Same-Day Care",
    sublabel: "Immediate emergency triage",
  },
];

export default function StatsCounterSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Ambient background circles */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10"
              >
                <div className="mx-auto h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base font-bold text-white/95">
                  {stat.label}
                </div>
                <div className="text-xs text-white/70">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
