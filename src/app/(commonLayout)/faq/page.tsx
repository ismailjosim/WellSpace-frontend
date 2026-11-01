"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  Calendar,
  CreditCard,
  Video,
  FileText,
  Sparkles,
} from "lucide-react";

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const faqCategories = [
    {
      category: "Appointments & Consultations",
      icon: Calendar,
      items: [
        {
          q: "How do I book an appointment with a doctor?",
          a: "Browse our doctor directory on the Consultation page, filter by specialty, rating, or fee, select an available time slot from the doctor's calendar, and choose either online payment or 'Pay Later'.",
        },
        {
          q: "Can I cancel or reschedule my appointment?",
          a: "Yes. Appointments can be canceled or rescheduled from your 'My Appointments' dashboard up to 24 hours prior to the scheduled start time without penalty.",
        },
        {
          q: "What happens if I miss my consultation time slot?",
          a: "If you fail to join within 15 minutes of the start time, the appointment is marked as a no-show. We advise joining the waiting room 5-10 minutes in advance.",
        },
      ],
    },
    {
      category: "Payments & Invoicing",
      icon: CreditCard,
      items: [
        {
          q: "What payment methods are supported?",
          a: "We support Visa, MasterCard, American Express, and regional mobile wallets securely processed through our PCI-DSS compliant Stripe payment gateway.",
        },
        {
          q: "How can I download an invoice for health insurance reimbursement?",
          a: "After a successful payment, navigate to My Appointments and click 'Download Invoice' or inspect your payment confirmation email.",
        },
        {
          q: "What if my payment fails during checkout?",
          a: "Your booking is temporarily held in 'UNPAID' status. You can click 'Pay Now' directly from your appointments dashboard to retry payment.",
        },
      ],
    },
    {
      category: "Telehealth & Video Rooms",
      icon: Video,
      items: [
        {
          q: "How do I join the live video consultation?",
          a: "When your appointment time arrives, a 'Join Consultation Room' button activates on your appointment details view. Click it to enter the encrypted video consultation room.",
        },
        {
          q: "Do I need to download third-party software like Zoom?",
          a: "No! WellSpace video consultations run natively in your web browser (Chrome, Safari, Firefox, Edge) using secure WebRTC standards.",
        },
        {
          q: "Can I share previous lab tests during the call?",
          a: "Yes. Both you and the doctor can upload or review documents in real-time, or share screens during the consultation.",
        },
      ],
    },
    {
      category: "Prescriptions & Health Records",
      icon: FileText,
      items: [
        {
          q: "How do I access my prescription after the call?",
          a: "As soon as the doctor issues your prescription, it appears under 'My Prescriptions' in your patient dashboard. You can view, print, or download a digitally signed PDF copy.",
        },
        {
          q: "Are WellSpace electronic prescriptions accepted by physical pharmacies?",
          a: "Yes. Our prescriptions contain the doctor's official medical council registration number, digital verification seal, and formatted clinical instructions recognized by pharmacies.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-primary border-primary/30 bg-primary/5 font-semibold uppercase tracking-wider text-[11px]"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Knowledge Hub
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Frequently Asked <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Questions</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Find answers to common questions regarding appointments, telehealth video rooms, prescriptions, and billing.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions (e.g., payment, video, prescription)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-full border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm shadow-xs"
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground space-y-2">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-base font-semibold text-foreground">No questions found</p>
            <p className="text-xs">Try searching with a different keyword or topic</p>
          </div>
        ) : (
          filteredCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="rounded-2xl border border-border/60 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{cat.category}</h3>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {cat.items.map((item, itemIdx) => (
                    <AccordionItem
                      key={itemIdx}
                      value={`item-${idx}-${itemIdx}`}
                      className="border-border/40"
                    >
                      <AccordionTrigger className="text-left font-semibold text-sm hover:text-primary transition-colors py-4">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
