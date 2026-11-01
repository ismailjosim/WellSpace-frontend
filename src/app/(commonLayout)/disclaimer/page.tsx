import { AlertTriangle, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-static";

export default function MedicalDisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      {/* Alert Header */}
      <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-xl">
          <AlertTriangle className="h-7 w-7 shrink-0" />
          <h1>Emergency Medical Care Notice</h1>
        </div>
        <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
          WELLSPACE TELEMEDICINE IS NOT DESIGNED FOR, NOR SHOULD IT EVER BE USED
          IN, LIFE-THREATENING OR TIME-CRITICAL MEDICAL EMERGENCIES.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <div className="bg-background rounded-lg px-4 py-2 border flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400">
            <PhoneCall className="h-4 w-4" />
            <span>National Emergency Call: 999 / 911</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            When to Seek Immediate Emergency Hospital Care
          </h2>
          <p>
            If you or someone under your care experiences any of the following
            symptoms, DO NOT book a telehealth appointment. Call emergency
            services or proceed immediately to the nearest hospital emergency
            room:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 font-medium text-foreground">
            <li>
              Severe crushing chest pain, pressure, or radiating pain to the
              jaw/arm.
            </li>
            <li>
              Sudden difficulty breathing, acute shortness of breath, or
              choking.
            </li>
            <li>
              Sudden loss of speech, facial drooping, numbness, or signs of
              stroke.
            </li>
            <li>Severe unprovoked head trauma or loss of consciousness.</li>
            <li>
              Uncontrolled active arterial bleeding or compound bone fractures.
            </li>
            <li>
              Severe allergic reaction (anaphylaxis) with facial swelling or
              throat constriction.
            </li>
            <li>
              Acute poisoning, toxic chemical ingestion, or suspected overdose.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            Appropriate Telehealth Usage
          </h2>
          <p>
            WellSpace is designed for non-emergency primary care, specialist
            second opinions, follow-up evaluations, chronic disease monitoring
            (diabetes, hypertension management), routine dermatological
            inquiries, mild colds/fevers, mental health counseling, and general
            preventative wellness.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            Doctor-Patient Relationship Limitation
          </h2>
          <p>
            Information provided across WellSpace informational articles, AI
            symptom suggestors, and marketing materials does not constitute a
            doctor-patient clinical relationship. A doctor-patient relationship
            is established strictly during a confirmed, active one-on-one
            consultation with an attending medical doctor.
          </p>
        </section>

        <div className="pt-6 border-t flex justify-center">
          <Button asChild>
            <Link href="/consultation">I Understand — Find a Doctor</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
