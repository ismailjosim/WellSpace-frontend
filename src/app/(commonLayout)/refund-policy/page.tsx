import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  RefreshCw,
  Clock,
  CreditCard,
  WifiOff,
  UserX,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

export default function RefundPolicyPage() {
  const policyHighlights = [
    {
      icon: Clock,
      title: "24-Hour Free Cancellation",
      description:
        "Cancel up to 24 hours prior to the scheduled consultation time for an immediate 100% full refund.",
    },
    {
      icon: UserX,
      title: "Doctor No-Show Protection",
      description:
        "If a doctor fails to join within 15 minutes of the start time, you receive a full refund plus priority rebooking.",
    },
    {
      icon: WifiOff,
      title: "Technical Disruption Shield",
      description:
        "If dropped video connections prevent completing a consultation, our clinical desk issues a full credit or refund.",
    },
    {
      icon: CreditCard,
      title: "Fast 5-7 Day Processing",
      description:
        "Approved refunds are automatically routed back to your original payment method (Stripe card or digital wallet).",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl space-y-14">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Consumer Protection
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Refund &amp; Cancellation{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            Policy
          </span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          We are committed to transparent, fair, and reliable medical billing.
          Review our policies regarding appointment cancellations, rescheduled
          slots, and refund timelines.
        </p>
        <p className="text-xs text-muted-foreground font-medium">
          Last Revised: November 2, 2026 | Effective for all global
          consultations
        </p>
      </div>

      {/* Key Guarantees Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {policyHighlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="rounded-2xl border border-border/60 bg-card/80 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-10 text-sm text-muted-foreground leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              1
            </span>
            Patient-Initiated Cancellations &amp; Rescheduling
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <p>
              We understand that personal schedules and medical conditions
              change. Our cancellation tiers are structured as follows:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">
                  More than 24 hours prior to appointment:
                </strong>{" "}
                100% full refund back to the original payment method, or instant
                rebooking credit without penalty.
              </li>
              <li>
                <strong className="text-foreground">
                  Between 2 and 24 hours prior:
                </strong>{" "}
                You may reschedule the appointment to another open slot of the
                same doctor for free. If you elect to cancel entirely, a 15%
                administrative preparation fee applies, with the remaining 85%
                refunded.
              </li>
              <li>
                <strong className="text-foreground">
                  Less than 2 hours or Patient No-Show:
                </strong>{" "}
                Incurred consultations where the patient fails to join the room
                within 15 minutes of the start time are non-refundable. This
                protects the licensed practitioner who reserved clinical time
                exclusively for your care.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              2
            </span>
            Doctor-Initiated Cancellations &amp; Emergency Delays
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <p>
              Medical practitioners occasionally encounter urgent in-hospital
              surgeries or acute medical emergencies that require shifting
              telemedicine availability:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                If a doctor cancels your consultation, you will be notified via
                SMS/email and automatically issued a{" "}
                <strong className="text-foreground">100% full refund</strong>{" "}
                immediately.
              </li>
              <li>
                Alternatively, you can choose to transfer your booking to the
                next available slot or consult another verified specialist in
                the same department with zero additional fee.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              3
            </span>
            Technical Disruptions &amp; Dropped Video Connections
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <p>
              High-definition video consultations require stable internet on
              both ends:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                If platform server degradation, WebRTC connection dropouts, or
                power interruptions prevent you from completing at least 50% of
                your consultation duration, you are entitled to a full session
                re-run or refund.
              </li>
              <li>
                Technical claims must be submitted to{" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                  support@wellspace.health
                </code>{" "}
                within 48 hours of the scheduled time. Our engineering logs will
                verify the session telemetry.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              4
            </span>
            Prescription &amp; Clinical Discretion Caveat
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <p>
              Please note: You are paying for a professional clinical
              consultation and diagnosis time, not for a guaranteed
              prescription. If an attending doctor determines that your symptoms
              require physical hospital auscultation or that requested
              medications (such as controlled substances) are not clinically
              indicated,{" "}
              <strong className="text-foreground">
                a refund will not be issued
              </strong>{" "}
              based on prescription disagreement.
            </p>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              5
            </span>
            Health Plans, Diagnostics &amp; Medicine Orders
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong className="text-foreground">
                  Monthly Health Plans:
                </strong>{" "}
                You can cancel subscription renewals at any time from your
                account settings. Subscriptions remain active until the end of
                the current billing cycle and will not renew.
              </li>
              <li>
                <strong className="text-foreground">
                  Prescription Medicine Fulfillment:
                </strong>{" "}
                Due to pharmaceutical safety regulations, dispensed medications
                cannot be returned or refunded once shipped from the licensed
                pharmacy, except in cases of damaged transit or incorrect
                dispatch.
              </li>
              <li>
                <strong className="text-foreground">
                  Home Diagnostic Sample Collection:
                </strong>{" "}
                Full refunds are provided if canceled at least 4 hours prior to
                the scheduled phlebotomist arrival time.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 p-6 rounded-3xl border border-border/60 bg-card/60">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-bold">
              6
            </span>
            Refund Processing Timelines
          </h2>
          <div className="space-y-2.5 text-xs sm:text-sm pl-8">
            <p>Once a refund request is authorized by our billing desk:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong className="text-foreground">
                  Credit / Debit Cards (Stripe):
                </strong>{" "}
                5 to 7 business days depending on your card issuer or banking
                institution.
              </li>
              <li>
                <strong className="text-foreground">
                  Digital Mobile Wallets (bKash / Nagad / Apple Pay):
                </strong>{" "}
                24 to 48 business hours.
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Support & Dispute Resolution Box */}
      <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-cyan-500/10 p-8 sm:p-10 text-center space-y-5">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          Need Help with a Billing Dispute or Refund?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Our dedicated patient advocacy and billing coordination team is on
          standby 24/7 to resolve questions swiftly.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Button asChild className="rounded-full px-6 font-semibold shadow-xs">
            <Link href="/contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Billing Desk
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 font-medium"
          >
            <Link href="/dashboard/my-appointments">
              View My Appointments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
