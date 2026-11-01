import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  ShieldAlert,
  CreditCard,
  UserCheck,
  Stethoscope,
  Scale,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function TermsOfServicePage() {
  const sections = [
    {
      id: "agreement",
      icon: FileText,
      title: "1. Agreement & Acceptance of Terms",
      content: (
        <>
          <p>
            By accessing, creating an account, or transacting on the WellSpace
            Telemedicine Platform (&quot;WellSpace&quot;, &quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have
            read, understood, and agreed to be legally bound by these Terms of
            Service. If you do not accept these terms in full, you must
            discontinue use of the platform immediately.
          </p>
          <p className="mt-2">
            These terms constitute a binding electronic agreement between you
            and WellSpace Health Inc., governing your access to web applications,
            APIs, video consultation rooms, and digital healthcare records.
          </p>
        </>
      ),
    },
    {
      id: "telehealth-nature",
      icon: Stethoscope,
      title: "2. Nature of Telehealth Services & Coordination",
      content: (
        <>
          <p>
            WellSpace operates as a specialized healthcare technology
            facilitator connecting certified, licensed medical professionals
            with registered patients. WellSpace verifies medical council
            credentials and maintains secure encrypted communication channels.
          </p>
          <p className="mt-2">
            Medical diagnosis, advice, prescriptions, and clinical judgment are
            exercised solely by the individual healthcare provider under their
            own professional license and clinical autonomy. The existence of
            WellSpace does not replace comprehensive in-person emergency hospital
            care.
          </p>
        </>
      ),
    },
    {
      id: "patient-conduct",
      icon: UserCheck,
      title: "3. Patient Conduct & Representation",
      content: (
        <>
          <p>As a patient user, you explicitly agree and warrant that you will:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2">
            <li>
              Provide true, precise, and current health information, known drug
              allergies, and existing prescriptions.
            </li>
            <li>
              Maintain the security and secrecy of your account credentials,
              session cookies, and 2FA authentication factors.
            </li>
            <li>
              Refrain from taking screen recordings, screenshots, or audio captures
              of attending physicians during consultations without express mutual
              written consent.
            </li>
            <li>
              Never impersonate another individual or register on behalf of a minor
              without documented legal guardian authority.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "refunds-cancellations",
      icon: CreditCard,
      title: "4. Appointments, Payments & Cancellation Rights",
      content: (
        <>
          <p>
            Consultation fees must be settled prior to appointment slot
            confirmation via our integrated PCI-DSS Level 1 payment processors
            (Stripe, SSLCommerz).
          </p>
          <p className="mt-2">
            Patients may cancel an appointment up to 24 hours prior to the
            scheduled start time for a 100% full refund to their original
            payment source. Cancellations within 24 hours or failure to enter the
            virtual consultation room within 15 minutes of the start time
            (&quot;no-show&quot;) are non-refundable to honor the reserved
            clinical time of the physician.
          </p>
          <div className="mt-3">
            <Link
              href="/refund-policy"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Read the comprehensive Refund & Cancellation Policy</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      ),
    },
    {
      id: "prescriptions",
      icon: Clock,
      title: "5. Clinical Discretion & Digital Prescriptions",
      content: (
        <>
          <p>
            Attending physicians exercise sole medical discretion regarding
            whether a telehealth session provides sufficient clinical basis to
            formulate a diagnosis or write a prescription.
          </p>
          <p className="mt-2">
            Controlled substances, schedule narcotics, or medications carrying
            severe potential for abuse or requiring physical diagnostic exams
            cannot be prescribed virtually pursuant to national drug enforcement
            regulations.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      icon: Scale,
      title: "6. Limitation of Liability & Indemnification",
      content: (
        <>
          <p>
            To the maximum extent permitted by applicable law, WellSpace and its
            affiliates, directors, and licensors shall not be held liable for any
            indirect, punitive, special, or consequential damages resulting from
            network connectivity interruptions, technical hardware limitations,
            or independent clinical advice rendered by healthcare providers.
          </p>
        </>
      ),
    },
    {
      id: "disclaimer",
      icon: ShieldAlert,
      title: "7. Emergency Situations & Hospital Referral",
      content: (
        <>
          <p>
            WELLSPACE IS STRICTLY AN OUTPATIENT TELEHEALTH PLATFORM AND IS NEVER
            APPROPRIATE FOR LIFE-THREATENING EMERGENCIES. If you experience chest
            pain, stroke symptoms, severe bleeding, or acute respiratory distress,
            you must call emergency services (999/911) or proceed immediately to
            the nearest emergency room.
          </p>
          <div className="mt-3">
            <Link
              href="/disclaimer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View full Emergency Medical Disclaimer</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/5 text-primary px-3 py-1 text-xs uppercase tracking-widest font-semibold"
          >
            Legal Terms & Conditions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Please read these terms carefully prior to scheduling consultations
            or accessing clinical services on WellSpace.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Last updated: November 1, 2026</span>
            <span>•</span>
            <span>Effective: November 1, 2026</span>
            <span>•</span>
            <span className="text-primary font-medium">Standard Patient Agreement</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.id}
                id={section.id}
                className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm"
              >
                <CardContent className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed pl-0 md:pl-13">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Support Footer Callout */}
        <div className="rounded-2xl border border-border/60 bg-accent/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-sm text-foreground">
              Questions regarding our legal terms?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Contact our legal and patient compliance team at legal@wellspace.health
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            Contact Legal Compliance →
          </Link>
        </div>
      </div>
    </div>
  );
}
