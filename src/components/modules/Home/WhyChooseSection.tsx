"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Clock,
  FileCheck2,
  Award,
  HeartPulse,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Board-Certified Doctors",
    description:
      "Every practitioner undergoes rigorous medical license verification and clinical background credentialing.",
  },
  {
    icon: Lock,
    title: "HIPAA & Bank-Grade Security",
    description:
      "Your medical history, live consultation audio/video, and diagnostic reports remain end-to-end encrypted.",
  },
  {
    icon: Clock,
    title: "Instant Same-Day Bookings",
    description:
      "Connect with qualified doctors in as little as 15 minutes without sitting in crowded waiting rooms.",
  },
  {
    icon: FileCheck2,
    title: "Digital Prescriptions & Invoices",
    description:
      "Download verifiable digital prescriptions with dosage guidelines and itemized insurance receipts instantly.",
  },
  {
    icon: Award,
    title: "Continuous Follow-Up Care",
    description:
      "Automatic clinical checkpoint reminders ensure you never miss scheduled follow-ups and recovery milestones.",
  },
  {
    icon: HeartPulse,
    title: "Transparent Pricing, No Hidden Fees",
    description:
      "Clear upfront consultation rates with flexible card payments and 24-hour full refund guarantees.",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
          >
            Clinical Reliability
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Why Thousands Trust{" "}
            <span className="bg-linear-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              WellSpace
            </span>
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Engineered to combine clinical precision with unmatched patient
            convenience and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card
                key={idx}
                className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
