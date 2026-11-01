import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, HeartPulse, Clock, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function AboutPage() {
  const stats = [
    { label: "Verified Specialists", value: "500+" },
    { label: "Successful Consultations", value: "25,000+" },
    { label: "Patient Satisfaction", value: "98.4%" },
    { label: "Available Specialties", value: "35+" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "100% Verified Practitioners",
      description:
        "Every doctor on WellSpace undergoes rigorous credentialing with medical licensing boards before treating patients.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Health Privacy",
      description:
        "Your clinical records, prescriptions, and consultation history are safeguarded with end-to-end encryption.",
    },
    {
      icon: Clock,
      title: "Care Without Delays",
      description:
        "Connect with top-rated medical specialists from home or on the go without waiting in crowded clinics.",
    },
    {
      icon: HeartPulse,
      title: "Holistic Care Ecosystem",
      description:
        "Seamless continuity from instant video consults to prescription fulfillment and preventative health plans.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="outline" className="text-primary border-primary/30">
          About WellSpace
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Transforming Healthcare Through Accessible Digital Consultations
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          WellSpace was established with a singular mission: to eliminate
          geographic and logistical boundaries in modern medicine, connecting
          patients directly with certified healthcare professionals anytime,
          anywhere.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-muted/40 border">
        {stats.map((stat, i) => (
          <div key={i} className="text-center space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-primary">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Patients Trust WellSpace
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            We hold ourselves to the highest clinical, ethical, and
            cybersecurity standards in telehealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="border-muted-foreground/20 hover:border-primary/50 transition"
              >
                <CardHeader className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-2xl bg-linear-to-r from-primary/15 via-primary/5 to-background border p-8 md:p-12 text-center space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold">
          Ready to Experience Modern Healthcare?
        </h3>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm">
          Join thousands of satisfied patients who consult certified doctors
          through WellSpace every day.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/consultation">
              Find a Doctor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
