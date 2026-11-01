"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="container mx-auto px-4 py-12 space-y-12 max-w-5xl">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Contact WellSpace Support
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Have a question about appointment bookings, doctor onboarding, or
          telehealth services? We are here to assist you 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Emergency & Helpline</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  +880 1700-000000
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Toll-free 24/7
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Email Inquiries</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  support@wellspace.health
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Typical response within 2 hours
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Headquarters</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  WellSpace Health Tower, Gulshan-2, Dhaka, Bangladesh
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Operational Hours</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Virtual Consultations: 24/7
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Support Desk: Monday - Saturday (8:00 AM - 10:00 PM)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and an agent will follow up promptly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">
                  Message Delivered Successfully
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Our clinical care coordinator has received your message and
                  will contact you via email shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Your Name</label>
                    <Input required placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Email Address</label>
                    <Input
                      required
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Subject</label>
                  <Input
                    required
                    placeholder="Appointment inquiry, feedback, or technical help"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Message</label>
                  <Textarea
                    required
                    rows={5}
                    placeholder="Provide details about how we can help you..."
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
