"use client";

import { AlertCircle, PhoneCall, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmergencyUrgentCareBanner() {
  return (
    <aside
      aria-label="Emergency and 24/7 virtual triage support"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 my-12"
    >
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0 border border-destructive/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-destructive text-destructive-foreground uppercase tracking-wider">
                Urgent Care Notice
              </span>
              <span className="text-xs text-muted-foreground">
                24/7 Clinical Support
              </span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Need Immediate Medical Guidance?
            </h3>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              For acute, non-life-threatening symptoms, book an instant
              consultation with our on-call general physicians. If you are
              experiencing chest pain, severe shortness of breath, or trauma,
              please contact your local emergency services (911 / 999)
              immediately.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <Link href="/consultation?searchTerm=General">
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 rounded-full font-medium"
            >
              <AlertCircle className="w-4 h-4 mr-1.5" />
              Fast Virtual Triage
            </Button>
          </Link>
          <Link href="/contact">
            <Button className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium shadow-sm">
              <PhoneCall className="w-4 h-4 mr-1.5" />
              Call Hotline
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
