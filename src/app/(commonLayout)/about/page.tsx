import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldCheck,
  HeartPulse,
  Clock,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function AboutPage() {
  const stats = [
    { label: "Verified Specialists", value: "500+" },
    { label: "Successful Consultations", value: "25,000+" },
    { label: "Patient Satisfaction", value: "98.4%" },
    { label: "Clinical Specialties", value: "35+" },
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
        "Your clinical records, prescriptions, and consultation history are safeguarded with HIPAA-compliant end-to-end encryption.",
    },
    {
      icon: Clock,
      title: "Care Without Delays",
      description:
        "Connect with top-rated medical specialists from home or on the go without waiting in crowded clinic queues.",
    },
    {
      icon: HeartPulse,
      title: "Holistic Care Ecosystem",
      description:
        "Seamless continuity from instant video consults to digital prescription fulfillment and preventative health plans.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 space-y-20">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center space-y-5">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          About WellSpace
        </Badge>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Pioneering the Future of{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Digital Health
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          WellSpace was established with a singular mission: to eliminate
          geographic and logistical boundaries in healthcare, connecting
          patients with certified medical professionals anytime, anywhere.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 rounded-3xl bg-card border border-border/60 shadow-lg">
        {stats.map((stat, i) => (
          <div key={i} className="text-center space-y-1">
            <p className="text-3xl md:text-5xl font-extrabold bg-gradient-to-br from-primary to-cyan-500 bg-clip-text text-transparent">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
          >
            Clinical Standards
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
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
                className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <CardHeader className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground">
                    {item.title}
                  </CardTitle>
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
      <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-card to-cyan-500/10 border border-primary/25 p-8 md:p-14 text-center space-y-6 shadow-xl overflow-hidden">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-4xl font-extrabold text-foreground">
            Ready to Experience Modern Healthcare?
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Join thousands of satisfied patients who consult certified doctors
            through WellSpace every day.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 py-6 font-semibold shadow-md"
          >
            <Link href="/consultation">
              Find a Doctor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-6 font-medium border-border/80"
          >
            <Link href="/contact">Contact Our Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
