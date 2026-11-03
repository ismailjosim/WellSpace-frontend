"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ContactDepartmentDirectory from "./contact-department-directory";
import {
  contactDepartments,
  isContactDepartmentId,
  type ContactDepartmentId,
} from "./contact-departments";

type ContactFormProps = {
  contactInformation: ReactNode;
};

export default function ContactForm({ contactInformation }: ContactFormProps) {
  const [department, setDepartment] = useState<ContactDepartmentId>("clinical");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const selectedDepartment =
    contactDepartments.find((item) => item.id === department) ??
    contactDepartments[0];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Thank you! Your message has been received by our support team.",
      );
    }, 1000);
  };

  return (
    <>
      <ContactDepartmentDirectory
        selectedDepartment={department}
        onSelectDepartment={setDepartment}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {contactInformation}
        <Card className="rounded-3xl border border-border/60 bg-card p-2 shadow-lg sm:p-4 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              Send Us a Direct Message
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Routing to:{" "}
              <strong className="text-foreground">
                {selectedDepartment.name}
              </strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 py-12 text-center" role="status">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Message Delivered Successfully
                </h3>
                <p className="mx-auto max-w-md text-xs leading-relaxed text-muted-foreground">
                  Our clinical care coordinator for the{" "}
                  {selectedDepartment.name} team has received your ticket and
                  will contact you via email shortly.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full px-5"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-semibold text-foreground"
                    >
                      Your Name <span aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder="John Doe"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-semibold text-foreground"
                    >
                      Email Address <span aria-hidden="true">*</span>
                    </label>
                    <Input
                      id="contact-email"
                      name="email"
                      autoComplete="email"
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-semibold text-foreground"
                    >
                      Phone Number (Optional)
                    </label>
                    <Input
                      id="contact-phone"
                      name="phone"
                      autoComplete="tel"
                      placeholder="+880 1..."
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-department"
                      className="text-xs font-semibold text-foreground"
                    >
                      Department
                    </label>
                    <select
                      id="contact-department"
                      name="department"
                      value={department}
                      onChange={(event) => {
                        if (isContactDepartmentId(event.target.value)) {
                          setDepartment(event.target.value);
                        }
                      }}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {contactDepartments.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="text-xs font-semibold text-foreground"
                  >
                    Subject <span aria-hidden="true">*</span>
                  </label>
                  <Input
                    id="contact-subject"
                    name="subject"
                    required
                    placeholder="Appointment inquiry, feedback, or refund assistance"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-semibold text-foreground"
                  >
                    Message Details <span aria-hidden="true">*</span>
                  </label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Provide details about how we can help you..."
                    className="resize-none rounded-2xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary px-7 py-5 font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    "Sending Message..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
