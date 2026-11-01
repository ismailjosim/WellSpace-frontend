"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
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
    <div className="container mx-auto px-4 sm:px-6 py-16 space-y-12 max-w-5xl">
      <div className="text-center space-y-4">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          24/7 Support Desk
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Contact <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">WellSpace</span> Support
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Have a question about appointment bookings, doctor onboarding, or telehealth services? Our clinical coordinators are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all">
            <CardContent className="pt-6 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Emergency & Helpline</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  +880 1700-000000
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">
                  Toll-free 24/7
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all">
            <CardContent className="pt-6 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  support@wellspace.health
                </p>
                <span className="inline-block mt-1 text-[10px] text-muted-foreground">
                  Response within 2 hours
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all">
            <CardContent className="pt-6 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Global Operations</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  WellSpace Health Tower, Gulshan-2, Dhaka, Bangladesh
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all">
            <CardContent className="pt-6 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Operating Schedule</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Telehealth Consults: 24/7
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Support Desk: Mon - Sat (8 AM - 10 PM)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-2 rounded-3xl border border-border/60 bg-card shadow-lg p-2 sm:p-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">Send Us a Direct Message</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Fill out the form below and an agent will follow up promptly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Message Delivered Successfully
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Our clinical care coordinator has received your message and will contact you via email shortly.
                </p>
                <Button
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Your Name</label>
                    <Input required placeholder="John Doe" className="rounded-xl h-11" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Email Address</label>
                    <Input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Subject</label>
                  <Input
                    required
                    placeholder="Appointment inquiry, feedback, or technical help"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Message</label>
                  <Textarea
                    required
                    rows={5}
                    placeholder="Provide details about how we can help you..."
                    className="resize-none rounded-2xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl px-7 py-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    "Sending Message..."
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
