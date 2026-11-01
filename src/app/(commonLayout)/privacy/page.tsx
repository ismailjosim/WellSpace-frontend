export const dynamic = "force-static";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: November 1, 2026 | Effective Date: November 1, 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
          <p>
            WellSpace Telemedicine Platform (&quot;WellSpace&quot;,
            &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to
            protecting the confidentiality, security, and integrity of your
            personal and health information. This Privacy Policy governs our
            collection, storage, and processing of your Electronic Protected
            Health Information (ePHI) in full accordance with applicable
            healthcare information privacy standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            2. Information We Collect
          </h2>
          <p>
            When you register, book consultations, or utilize WellSpace, we
            collect:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <strong>Account Identity:</strong> Full name, email address,
              contact telephone number, and residential address.
            </li>
            <li>
              <strong>Clinical Health Data:</strong> Allergies, chronic
              conditions (e.g. diabetes), immunization status, blood group, past
              surgical interventions, and uploaded medical diagnostic reports.
            </li>
            <li>
              <strong>Consultation Artifacts:</strong> Digital prescription
              records, consultation timestamps, doctor clinical notes, and
              review ratings.
            </li>
            <li>
              <strong>Financial Metadata:</strong> Payment transaction
              identifiers and timestamps. Note that raw credit card numbers are
              processed directly by Stripe and are never stored on our servers.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            3. How We Use and Protect Health Data
          </h2>
          <p>
            Your health records and diagnostic documents are strictly utilized
            to enable your attending doctor to provide informed medical
            consultations. We implement AES-256 encryption at rest and TLS 1.3
            encryption in transit. Strict Role-Based Access Controls (RBAC)
            ensure that non-attending parties cannot access your private
            records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            4. Disclosure to Third Parties
          </h2>
          <p>
            We will never sell, lease, or monetize your health information. Data
            is shared exclusively with:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Your chosen, verified consulting doctors.</li>
            <li>
              Cloud storage and infrastructure providers (e.g., Cloudinary for
              medical documents) under strict data protection agreements.
            </li>
            <li>Payment processors (Stripe) to process consultation fees.</li>
            <li>
              Statutory public health authorities only when strictly mandated by
              legal subpoenas or public emergency reporting statutes.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">
            5. Your Legal Rights
          </h2>
          <p>
            You have the right to request a full export of your medical history,
            rectify inaccuracies, or delete your account. For privacy inquiries,
            please contact our Data Protection Officer at{" "}
            <span className="text-primary font-medium">
              privacy@wellspace.health
            </span>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
