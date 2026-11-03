import {
  AlertTriangle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-5xl space-y-12 px-4 py-16 sm:px-6">
      <header className="space-y-4 text-center">
        <Badge
          variant="outline"
          className="rounded-full border-primary/30 bg-primary/5 px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary"
        >
          <MessageSquare className="mr-1 h-3 w-3" aria-hidden="true" />
          24/7 Support Desk
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Contact{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            WellSpace
          </span>{" "}
          Support
        </h1>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
          Have a question about appointment bookings, doctor onboarding, or
          telehealth services? Our clinical coordinators are here to assist you.
        </p>
      </header>

      <section
        aria-labelledby="emergency-notice"
        className="flex flex-col items-center justify-between gap-4 rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-5 sm:flex-row md:p-6"
      >
        <div className="flex items-start gap-3.5">
          <div className="shrink-0 rounded-xl bg-red-500/20 p-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2
              id="emergency-notice"
              className="text-sm font-bold text-foreground"
            >
              Are you experiencing a medical emergency?
            </h2>
            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
              Do not wait for a contact reply if you have chest pain, sudden
              difficulty breathing, or severe trauma. Call your local emergency
              hotline immediately.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="destructive"
            className="rounded-full px-4 font-bold shadow-sm"
          >
            <a href="tel:999" className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Call 999 / 911</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-full px-3 text-xs"
          >
            <Link href="/disclaimer">Read Disclaimer</Link>
          </Button>
        </div>
      </section>

      <ContactForm
        contactInformation={
          <div
            aria-label="Contact and operating information"
            className="space-y-4 md:col-span-1"
          >
            <Card className="rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40">
              <CardContent className="flex items-start gap-3.5 pt-6">
                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    24/7 Patient Hotline
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    +880 1700-000000
                  </p>
                  <p className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                    Toll-free 24/7 Care
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40">
              <CardContent className="flex items-start gap-3.5 pt-6">
                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Email Support Desk
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    support@wellspace.health
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Response within 2 hours
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40">
              <CardContent className="flex items-start gap-3.5 pt-6">
                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Global Operations HQ
                  </h2>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    WellSpace Health Tower, Level 14, Gulshan-2, Dhaka,
                    Bangladesh
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/40">
              <CardContent className="flex items-start gap-3.5 pt-6">
                <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">
                    Operating Schedule
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Telehealth Consults: 24/7 Continuous
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Support Desk: Mon - Sat (8 AM - 10 PM)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        }
      />
    </main>
  );
}
