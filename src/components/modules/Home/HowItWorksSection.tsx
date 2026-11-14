"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, CalendarCheck, Video, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Find Your Specialist",
    description:
      "Search by medical specialty, symptom, or use our smart AI triage to match with board-certified doctors in seconds.",
  },
  {
    step: "02",
    icon: CalendarCheck,
    title: "Choose Convenient Slot",
    description:
      "Select from live available doctor schedules for same-day video appointments or planned follow-up consultations.",
  },
  {
    step: "03",
    icon: Video,
    title: "Consult & Get Care",
    description:
      "Join secure HIPAA-compliant video room, consult directly, receive digital prescriptions and immediate clinical notes.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-accent/20 border-y border-border/50 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
          >
            Simple Care Process
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            How WellSpace{" "}
            <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Accessible, compassionate, and modern healthcare delivered to your
            device in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 space-y-5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/20 font-mono">
                      {item.step}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center text-xs font-semibold text-primary">
                    <span>Step {index + 1} of 3</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/consultation">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 font-semibold shadow-md gap-2"
            >
              <span>Start Your Consultation Now</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
