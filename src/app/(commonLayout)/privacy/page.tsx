import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lock,
  Eye,
  Database,
  FileCheck2,
  Trash2,
  ShieldCheck,
  Server,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: "AES-256 Encryption at Rest",
      description:
        "All patient medical histories, clinical prescriptions, and diagnostic uploads are encrypted at rest using AES-256 with managed KMS keys.",
    },
    {
      icon: KeyRound,
      title: "TLS 1.3 In-Flight Security",
      description:
        "Video streams, audio packets, and chat messages transmit over authenticated WebRTC and HTTPS endpoints secured with TLS 1.3.",
    },
    {
      icon: Database,
      title: "Strict Role-Based Access (RBAC)",
      description:
        "Access to electronic protected health information (ePHI) is strictly limited to authorized treating physicians and patient-designated proxies.",
    },
    {
      icon: Server,
      title: "Immutable Audit Trails",
      description:
        "Every patient profile view, prescription download, and medical record modification logs an immutable tamper-evident audit record.",
    },
  ];

  const privacySections = [
    {
      id: "collection",
      icon: Eye,
      title: "1. Information We Collect",
      content: (
        <>
          <p>
            WellSpace collects only the minimum personal and health data
            strictly necessary to furnish safe telemedicine services:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2">
            <li>
              <strong>Account Identity:</strong> Full legal name, date of birth,
              gender, primary email address, mobile phone number, and emergency contact.
            </li>
            <li>
              <strong>Electronic Protected Health Information (ePHI):</strong> Blood
              group, known allergies, chronic conditions, current medication
              schedules, immunization records, and uploaded lab test reports.
            </li>
            <li>
              <strong>Consultation Records:</strong> Session timestamps, duration,
              doctor clinical visit notes, ICD-10 diagnostic codes, and digital
              prescriptions.
            </li>
            <li>
              <strong>Payment Metadata:</strong> Transaction IDs, card brand, and
              last 4 digits (full card credentials are tokenized directly by PCI-DSS
              Level 1 Stripe / SSLCommerz gateways; WellSpace never stores raw card
              numbers).
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "usage",
      icon: FileCheck2,
      title: "2. How We Use Your Health Data",
      content: (
        <>
          <p>
            Your health information is utilized exclusively for clinical care
            coordination:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2">
            <li>Matching you with qualified medical specialists and reviewing doctor availability.</li>
            <li>Enabling treating physicians to review your health records prior to consultation.</li>
            <li>Generating official digitally verifiable prescriptions and follow-up guidance.</li>
            <li>Delivering automated appointment reminders via email and transactional notifications.</li>
          </ul>
          <p className="mt-3 font-semibold text-foreground">
            WELLSPACE NEVER SELLS, LEASES, OR MONETIZES PATIENT PERSONAL OR CLINICAL DATA TO THIRD PARTIES OR PHARMACEUTICAL ADVERTISERS.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      icon: Database,
      title: "3. Data Retention & Record Archival",
      content: (
        <>
          <p>
            Pursuant to statutory clinical record retention mandates, patient
            medical consultation records and digital prescriptions are preserved
            for a minimum statutory period of seven (7) years from the date of
            service creation.
          </p>
          <p className="mt-2">
            Non-clinical diagnostic staging uploads or draft notes may be deleted
            at any time upon verified patient request.
          </p>
        </>
      ),
    },
    {
      id: "patient-rights",
      icon: Trash2,
      title: "4. Your Data Protection Rights",
      content: (
        <>
          <p>Under applicable healthcare data privacy frameworks, you hold:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2 pl-2">
            <li>
              <strong>Right to Access & Portability:</strong> Instantly view and
              download your electronic medical records and prescriptions in PDF/JSON format.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of inaccurate
              demographic or personal background data.
            </li>
            <li>
              <strong>Right to Erasure (Account Deletion):</strong> Request account
              deactivation and redaction of non-statutory personal identifiers.
            </li>
            <li>
              <strong>Consent Revocation:</strong> Revoke optional notifications or
              diagnostic sharing preferences at any time.
            </li>
          </ul>
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
            Data Privacy & Security Standard
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Privacy Policy & ePHI Protection
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Our highest priority is preserving the confidentiality, integrity,
            and security of your personal health information.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
            <span>Last updated: November 1, 2026</span>
            <span>•</span>
            <span>Standard: HIPAA / GDPR Aligned</span>
            <span>•</span>
            <span className="text-primary font-medium">Zero Data Monetization</span>
          </div>
        </div>

        {/* Security Pillars Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Technical Security Safeguards
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {securityPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm"
                >
                  <CardContent className="p-5 space-y-2.5">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pillar.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {privacySections.map((section) => {
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

        {/* DPO Contact Banner */}
        <div className="rounded-2xl border border-border/60 bg-accent/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-sm text-foreground">
              Contact our Data Protection Officer (DPO)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Submit data access requests, deletion tickets, or privacy questions to dpo@wellspace.health
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 text-xs font-semibold text-primary hover:underline"
          >
            Contact Privacy Officer →
          </Link>
        </div>
      </div>
    </div>
  );
}
