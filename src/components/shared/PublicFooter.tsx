"use client";

import Link from "next/link";
import { Stethoscope, Twitter, Linkedin, Facebook, ShieldCheck, Lock, Activity } from "lucide-react";

const PublicFooter = () => {
  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Consultation", href: "/consultation" },
    { name: "Health Plans", href: "/health-plans" },
    { name: "Medicine Store", href: "/medicine" },
  ];

  const supportLinks = [
    { name: "FAQ", href: "/faq" },
    { name: "Contact Support", href: "/contact" },
    { name: "Diagnostic Centers", href: "/diagnostics" },
    { name: "NGO Partners", href: "/ngos" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Medical Disclaimer", href: "/disclaimer" },
  ];

  const socialLinks = [
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Facebook", href: "#", icon: Facebook },
  ];

  return (
    <footer className="relative border-t border-border/40 bg-card/60 backdrop-blur-md text-card-foreground">
      {/* Top ambient highlight line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-cyan-500 text-primary-foreground shadow-md shadow-primary/20">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                WellSpace
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Next-generation clinical telehealth platform connecting patients with certified medical specialists, powered by intelligent diagnostic matching.
            </p>

            {/* Live Telehealth Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Telehealth Grid: Operational (99.98% uptime)</span>
            </div>

            {/* Social Links */}
            <div className="flex space-x-2.5 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust & Compliance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Compliance
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-border/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>HIPAA Compliant Care</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>256-bit AES Encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
          <p>© {new Date().getFullYear()} WellSpace Health Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-primary">
              <Activity className="h-3.5 w-3.5" />
              <span>Certified Telehealth Network</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
