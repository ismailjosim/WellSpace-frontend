import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  DollarSign,
  Pill,
  Shield,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

const features = [
  {
    icon: Pill,
    title: "Wide Selection",
    description: "Browse essential medicines and healthcare products.",
  },
  {
    icon: DollarSign,
    title: "Fair Prices",
    description: "Transparent pricing with planned discounts and offers.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Reliable doorstep delivery for approved orders.",
  },
  {
    icon: Shield,
    title: "Genuine Products",
    description: "Medicines sourced from licensed pharmacy partners.",
  },
  {
    icon: Clock,
    title: "24/7 Ordering",
    description: "Order anytime and track your request online.",
  },
  {
    icon: ShoppingCart,
    title: "Easy Checkout",
    description: "Simple prescription upload and ordering flow.",
  },
];

export default function MedicinePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4" variant="outline">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Online Medicine Store
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Order prescribed medicines online and get them delivered safely
          through verified pharmacy partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">How It Will Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {["Upload Prescription", "Place Order", "Get Delivered"].map(
                (step, index) => (
                  <div key={step} className="space-y-2">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold text-xl">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold">{step}</h3>
                    <p className="text-sm text-muted-foreground">
                      {index === 0
                        ? "Upload your doctor prescription or choose approved essentials."
                        : index === 1
                          ? "Confirm items and delivery details."
                          : "Receive medicines at your doorstep."}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/consultation">Book a Consultation First</Link>
        </Button>
      </div>
    </div>
  );
}
