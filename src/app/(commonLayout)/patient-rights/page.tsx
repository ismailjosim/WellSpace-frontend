import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  UserCheck,
  HelpCircle,
  PhoneCall,
  Scale,
  Award,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function PatientRightsPage() {
  const coreRights = [
    {
      icon: UserCheck,
      title: "Right to Respectful, Nondiscriminatory Care",
      description:
        "Every patient is entitled to compassionate, respectful care free from discrimination based on race, ethnicity, religion, sexual orientation, gender identity, disability, or socioeconomic status.",
    },
    {
      icon: FileCheck2,
      title: "Informed Telehealth Consent",
      description:
        "You have the right to receive clear explanations regarding the benefits, risks, limitations, and alternative treatments available through virtual consultations before consenting to care.",
    },
    {
      icon: Lock,
      title: "Strict Confidentiality & Data Privacy",
      description:
        "Your electronic protected health information (ePHI), clinical consultations, and medical history are safeguarded with AES-256 encryption and strict access governance.",
    },
    {
      icon: Award,
      title: "Verified Practitioner Credentials",
      description:
        "You have the right to know your treating physician's full professional name, medical licensing council registration number, specialty board certifications, and clinical qualifications.",
    },
    {
      icon: Scale,
      title: "Full Access to Medical Records",
      description:
        "You hold continuous ownership and instant digital access to your electronic health records, diagnostic uploads, clinical summaries, and digital prescriptions within WellSpace.",
    },
    {
      icon: ShieldCheck,
      title: "Right to Refuse or Terminate Care",
      description:
        "You retain complete autonomy to discontinue a video consultation, refuse recommended medications or procedures, and seek an in-person second opinion at any time.",
    },
  ];

  const patientResponsibilities = [
    "Provide accurate, truthful, and comprehensive personal health background, allergies, and existing medications.",
    "Ensure you are in a quiet, private, and secure room during video consultations to preserve your personal confidentiality.",
    "Review and clarify treatment instructions, dosage guidelines, and follow-up schedules with your practitioner.",
    "Treat medical staff, doctors, and customer care personnel with courtesy, mutual dignity, and respect.",
    "Adhere to payment schedules and report any billing or insurance discrepancies promptly to our administration.",
  ];

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary px-3 py-1 text-xs uppercase tracking-widest font-semibold"
          >
            Clinical Ethics & Governance
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Patient Bill of Rights & Telehealth Consent
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            At WellSpace, patient safety, dignity, and autonomy are our highest
            commitments. Learn about your legal rights as a virtual care patient
            and how we safeguard your healthcare journey.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Last reviewed: November 1, 2026</span>
            <span>•</span>
            <span>Version: 3.2.0</span>
            <span>•</span>
            <span className="text-primary font-medium">
              Compliance Certified
            </span>
          </div>
        </div>

        {/* Core Rights Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Your Essential Patient Rights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreRights.map((right, idx) => {
              const Icon = right.icon;
              return (
                <Card
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-all"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-base text-foreground">
                      {right.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {right.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Informed Telehealth Consent Details */}
        <div className="rounded-2xl border border-border/80 bg-accent/20 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Informed Telehealth Consent Guidelines
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                1. Technology & Diagnostic Limitations
              </h4>
              <p>
                Virtual consultations utilize secure high-definition video,
                audio, and digital chat. However, telehealth cannot replicate
                hands-on palpation, auscultation, or comprehensive physical
                exams. Your doctor may determine that an in-person examination
                or lab testing is medically necessary before issuing diagnoses.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                2. Electronic Prescriptions & Controlled Substances
              </h4>
              <p>
                Physicians issue digital prescriptions through our verified
                network. In accordance with federal and local pharmaceutical
                laws, certain schedule controlled substances, narcotics, or
                psychiatric medications cannot be prescribed via virtual visits
                without a prior documented in-person evaluation.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                3. Technical Connection Interruption
              </h4>
              <p>
                In the event of a broadband or hardware disconnection exceeding
                5 minutes during an ongoing consultation, our platform protocol
                prompts immediate reconnection or automatic rescheduling at zero
                additional charge to the patient.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">
                4. Cross-Border & Jurisdictional Authority
              </h4>
              <p>
                All practicing doctors on WellSpace hold valid licenses in the
                jurisdiction where patient care is registered. Medical advice is
                governed by the statutory standards of the corresponding
                national medical council.
              </p>
            </div>
          </div>
        </div>

        {/* Patient Responsibilities */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Mutual Expectations & Patient Responsibilities
            </h2>
          </div>
          <Card className="rounded-2xl border border-border/60 bg-card p-6 md:p-8">
            <p className="text-sm text-muted-foreground mb-4">
              Safe healthcare is a mutual partnership between patient and
              medical provider. By using WellSpace, patients agree to uphold the
              following:
            </p>
            <ul className="space-y-3 text-sm text-foreground">
              {patientResponsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="leading-relaxed">{resp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Grievance & Ombudsman Callout */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold">
              <HelpCircle className="h-5 w-5" />
              <span>Patient Advocacy & Grievance Department</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Have concerns about your clinical care or treatment?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl">
              Our independent Clinical Quality Committee investigates all
              patient complaints, provider conduct concerns, and privacy
              inquiries within 48 business hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button asChild className="rounded-full shadow-md font-semibold">
              <Link href="/contact" className="flex items-center gap-2">
                <span>File a Grievance</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/80"
            >
              <a href="tel:+8801700000000" className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4" />
                <span>Patient Hotline</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
