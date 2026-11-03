import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  PhoneCall,
  Stethoscope,
  ShieldAlert,
  Flame,
  Activity,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function MedicalDisclaimerPage() {
  const emergencySymptoms = [
    {
      title: "Acute Chest Pain & Heart Symptoms",
      description:
        "Crushing chest pressure, pain radiating to the jaw, neck, back, or left arm, sudden severe arrhythmia, or sudden unexplained cold sweat.",
    },
    {
      title: "Signs of Stroke (F.A.S.T.)",
      description:
        "Facial drooping, arm weakness or numbness on one side, sudden slurred speech or inability to formulate words, sudden vision blackout.",
    },
    {
      title: "Severe Respiratory Distress",
      description:
        "Severe shortness of breath, gasping for air, choking, blue/gray discoloration of the lips or nail beds, or acute asthma attacks unresponsive to rescue inhalers.",
    },
    {
      title: "Severe Trauma & Uncontrolled Bleeding",
      description:
        "Heavy hemorrhaging that does not stop with direct compression, major fractures, traumatic head injuries, or sudden loss of consciousness.",
    },
    {
      title: "Acute Poisoning & Drug Overdose",
      description:
        "Accidental ingestion of toxins, household chemicals, or excessive pharmaceutical substances. Call poison control or rush to emergency room.",
    },
    {
      title: "Severe Psychiatric Crisis",
      description:
        "Active suicidal ideation, intent to harm oneself or others, or acute psychosis. Call national mental health suicide crisis hotlines immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge
            variant="destructive"
            className="px-3 py-1 text-xs uppercase tracking-widest font-semibold"
          >
            Emergency Medical Care Notice
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Medical Disclaimer & Emergency Guidelines
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Please review these critical guidelines regarding the clinical
            scope, boundaries, and limitations of the WellSpace Telemedicine
            Platform.
          </p>
        </div>

        {/* Big Emergency Alert Banner */}
        <div className="rounded-3xl border-2 border-red-500/40 bg-gradient-to-br from-red-500/15 via-red-500/5 to-background p-6 md:p-8 space-y-6 shadow-lg shadow-red-500/5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-red-600 dark:text-red-400 tracking-tight">
                DO NOT USE WELLSPACE FOR LIFE-THREATENING EMERGENCIES
              </h2>
              <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
                WellSpace is an outpatient telehealth service. If you or someone
                under your care requires urgent medical resuscitation or
                hospital care, call emergency services immediately or go to the
                nearest emergency room.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              variant="destructive"
              className="rounded-full font-bold shadow-md"
            >
              <a href="tel:999" className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>Call National Emergency: 999</span>
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-red-500/40 hover:bg-red-500/10 font-bold"
            >
              <a href="tel:911" className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>North America Hotline: 911</span>
              </a>
            </Button>
          </div>
        </div>

        {/* Red Flag Symptoms Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-foreground font-bold text-lg">
            <Flame className="h-5 w-5 text-red-500" />
            <h3>When You Must Go Immediately to a Hospital Emergency Room</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencySymptoms.map((symptom, idx) => (
              <Card
                key={idx}
                className="rounded-2xl border border-red-500/20 bg-card/60 backdrop-blur-sm"
              >
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                    <Activity className="h-4 w-4" />
                    <h4>{symptom.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {symptom.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Clinical Limitations Details */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Stethoscope className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Telemedicine Boundaries & Doctor-Patient Relationship
              </h3>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
              <p>
                No doctor-patient relationship is established simply by browsing
                WellSpace or reviewing medical specialist profiles. A clinical
                relationship is only formed during a scheduled, confirmed
                consultation with an individual licensed physician.
              </p>
              <p>
                Online interactions cannot replace physical palpation,
                stethoscope auscultation, or comprehensive vital signs checks.
                Attending doctors hold full clinical authority to determine that
                a patient must be referred to an in-person clinic or diagnostic
                center.
              </p>
            </div>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Prescription Drug Restrictions
              </h3>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                Practitioners on WellSpace do not prescribe controlled
                narcotics, schedule psychotropic medications, or substances with
                substantial risk of physical dependence.
              </p>
              <p>
                Physicians issue digital prescriptions only when clinically
                appropriate and in strict accordance with national medical
                council regulations.
              </p>
            </div>
          </Card>
        </div>

        {/* Bottom Banner */}
        <div className="rounded-2xl border border-border/60 bg-accent/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-bold text-sm text-foreground">
                Have questions about telehealth appropriateness?
              </p>
              <p className="text-xs text-muted-foreground">
                Our clinical triage coordinators are available 24/7 to help
                guide non-emergency inquiries.
              </p>
            </div>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full shrink-0"
          >
            <Link href="/contact" className="flex items-center gap-1.5">
              <span>Contact Triage</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
