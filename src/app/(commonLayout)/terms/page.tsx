export const dynamic = "force-static";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: November 1, 2026 | Effective Date: November 1, 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or creating an account on the WellSpace Telemedicine
            Platform (&quot;WellSpace&quot;), you acknowledge that you have
            read, understood, and agreed to be legally bound by these Terms of
            Service. If you do not agree to these terms, you must not use our
            platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            2. Nature of Telehealth Services
          </h2>
          <p>
            WellSpace operates as a technology coordination platform that
            facilitates video and communication connections between independent,
            licensed medical practitioners and prospective patients. While
            WellSpace verifies medical council credentials, medical advice is
            rendered directly by the individual healthcare provider under their
            professional license.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            3. User Responsibilities & Patient Conduct
          </h2>
          <p>As a patient user, you agree to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              Provide truthful, accurate, and complete health data, known drug
              allergies, and current medications.
            </li>
            <li>
              Maintain the confidentiality of your account credentials and 2FA
              recovery codes.
            </li>
            <li>
              Refrain from recording audio or video of doctors during video
              consultations without explicit mutual consent.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            4. Appointment Cancellations & Refund Policies
          </h2>
          <p>
            Patients may cancel an appointment up to 24 hours prior to the
            scheduled start time for a full refund or credit. Cancellations made
            within 24 hours or patient failure to attend the consultation room
            within 15 minutes of the start time (&quot;no-show&quot;) are
            non-refundable to compensate the attending doctor for reserved
            clinical time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            5. Prescriptions & Clinical Discretion
          </h2>
          <p>
            Doctors retain sole professional discretion to determine whether a
            virtual consultation is clinically sufficient to issue a
            prescription. Controlled substances, narcotics, or medications
            requiring physical diagnostic auscultation may not be prescribed
            online pursuant to applicable medical guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            6. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, WellSpace shall
            not be liable for any indirect, incidental, or consequential damages
            arising out of your reliance on services rendered via the platform.
          </p>
        </section>
      </div>
    </div>
  );
}
