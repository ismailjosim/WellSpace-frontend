import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

const plans = [
  {
    name: "Basic Plan",
    price: "৳499",
    period: "/month",
    description: "Simple coverage for routine digital healthcare.",
    features: [
      "2 doctor consultations per month",
      "Basic health checkup guidance",
      "Prescription management",
      "Health records access",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Family Plan",
    price: "৳1,499",
    period: "/month",
    description: "Broader support for families and frequent care needs.",
    features: [
      "Unlimited doctor consultations",
      "Annual health checkup for 4 members",
      "Priority appointment booking",
      "Specialist consultations",
      "Medicine discounts up to 20%",
      "Diagnostic test discounts",
    ],
    popular: true,
  },
  {
    name: "Premium Plan",
    price: "৳2,999",
    period: "/month",
    description: "High-touch care coordination for ongoing health needs.",
    features: [
      "Unlimited consultations across specialties",
      "Comprehensive annual checkup",
      "Emergency consultation support",
      "Dedicated health manager",
      "Medicine discounts up to 30%",
      "Mental health support",
    ],
    popular: false,
  },
];

export default function HealthPlansPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Health Plans & Packages</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that fits your care needs, from routine consultations to family coverage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Shield, title: "Coverage", desc: "Core digital care services" },
          { icon: Users, title: "Family Ready", desc: "Plans for household care" },
          { icon: Zap, title: "Fast Access", desc: "Quick appointment booking" },
          { icon: CheckCircle, title: "Verified Care", desc: "Trusted healthcare providers" },
        ].map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Card key={benefit.title} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "relative border-primary shadow-lg" : "relative"}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge>Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-primary">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Plan?</h2>
          <p className="text-muted-foreground mb-6">
            Contact support to create a healthcare package for your organization or family.
          </p>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
