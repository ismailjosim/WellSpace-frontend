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
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Stethoscope,
  CreditCard,
  Building2,
  PhoneCall,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [department, setDepartment] = useState("clinical");

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

  const departments = [
    {
      id: "clinical",
      name: "Patient & Clinical Care",
      icon: Stethoscope,
      email: "clinical@wellspace.health",
      phone: "+880 1700-000001",
      description: "Consultation coordination, prescription queries, and patient records.",
    },
    {
      id: "billing",
      name: "Billing & Refund Inquiries",
      icon: CreditCard,
      email: "billing@wellspace.health",
      phone: "+880 1700-000002",
      description: "Payment status, invoice receipts, and 24-hr refund requests.",
    },
    {
      id: "providers",
      name: "Doctor Credentialing",
      icon: UserCheck,
      email: "providers@wellspace.health",
      phone: "+880 1700-000003",
      description: "Physician onboarding, BMDC verification, and scheduling portal.",
    },
    {
      id: "corporate",
      name: "Corporate Health & NGOs",
      icon: Building2,
      email: "enterprise@wellspace.health",
      phone: "+880 1700-000004",
      description: "Employee health benefits, NGO camps, and diagnostic center tie-ups.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 space-y-12 max-w-5xl">
      {/* Header */}
      <div className="text-center space-y-4">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
        >
          <MessageSquare className="w-3 h-3 mr-1" />
          24/7 Support Desk
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Contact{" "}
          <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
            WellSpace
          </span>{" "}
          Support
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Have a question about appointment bookings, doctor onboarding, or telehealth services? Our clinical coordinators are here to assist you.
        </p>
      </div>

      {/* Emergency Triage Notice */}
      <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground">
              Are you experiencing a medical emergency?
            </h4>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Do not wait for a contact reply if you have chest pain, sudden difficulty breathing, or severe trauma. Call your local emergency hotline immediately.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button asChild size="sm" variant="destructive" className="rounded-full px-4 font-bold shadow-sm">
            <a href="tel:999" className="flex items-center gap-1.5">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Call 999 / 911</span>
            </a>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full px-3 text-xs">
            <Link href="/disclaimer">Read Disclaimer</Link>
          </Button>
        </div>
      </div>

      {/* Department Routing Directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">
          Direct Department Directory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            const isSelected = department === dept.id;
            return (
              <Card
                key={dept.id}
                onClick={() => setDepartment(dept.id)}
                className={`cursor-pointer rounded-2xl border transition-all ${
                  isSelected
                    ? "border-primary shadow-md bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 bg-card hover:border-primary/40"
                }`}
              >
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-foreground">
                      {dept.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      {dept.description}
                    </p>
                  </div>
                  <div className="pt-1 border-t border-border/40 text-[11px] space-y-0.5 text-muted-foreground">
                    <p className="font-medium text-foreground">{dept.email}</p>
                    <p>{dept.phone}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Contact Cards & Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <Card className="rounded-2xl border border-border/60 bg-card hover:border-primary/40 transition-all">
            <CardContent className="pt-6 flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">24/7 Patient Hotline</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  +880 1700-000000
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">
                  Toll-free 24/7 Care
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
                <p className="font-bold text-sm text-foreground">Email Support Desk</p>
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
                <p className="font-bold text-sm text-foreground">Global Operations HQ</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  WellSpace Health Tower, Level 14, Gulshan-2, Dhaka, Bangladesh
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
                  Telehealth Consults: 24/7 Continuous
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
            <CardTitle className="text-xl font-bold text-foreground">
              Send Us a Direct Message
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Routing to:{" "}
              <strong className="text-foreground">
                {departments.find((d) => d.id === department)?.name}
              </strong>
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
                  Our clinical care coordinator for the {departments.find((d) => d.id === department)?.name} team has received your ticket and will contact you via email shortly.
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
                    <label className="text-xs font-semibold text-foreground">
                      Your Name
                    </label>
                    <Input
                      required
                      placeholder="John Doe"
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Email Address
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Phone Number (Optional)
                    </label>
                    <Input
                      placeholder="+880 1..."
                      className="rounded-xl h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Subject
                  </label>
                  <Input
                    required
                    placeholder="Appointment inquiry, feedback, or refund assistance"
                    className="rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Message Details
                  </label>
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
