import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bone, Brain, FileText, Heart, Microscope } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";

const services = [
  { icon: Activity, title: "Blood Tests", description: "CBC, lipid profile, diabetes screening.", tests: "50+ tests" },
  { icon: Heart, title: "Cardiac Tests", description: "ECG, echo, stress tests, cardiac markers.", tests: "15+ tests" },
  { icon: Brain, title: "Imaging", description: "X-ray, MRI, CT scan, ultrasound.", tests: "20+ tests" },
  { icon: Microscope, title: "Pathology", description: "Urine, stool, culture tests, biopsies.", tests: "40+ tests" },
  { icon: Bone, title: "Radiology", description: "Bone density and specialized imaging.", tests: "10+ tests" },
  { icon: FileText, title: "Health Packages", description: "Preventive health checkup packages.", tests: "8 packages" },
];

export default function DiagnosticsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4" variant="outline">Coming Soon</Badge>
        <h1 className="text-4xl font-bold text-primary mb-4">Diagnostic Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Book diagnostic tests online and receive reports digitally from trusted lab partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{service.tests}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20 mb-12">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose WellSpace Diagnostics?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Accredited lab partners",
                "Home sample collection",
                "Digital reports in your dashboard",
                "Affordable package pricing",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item}</h3>
                    <p className="text-sm text-muted-foreground">
                      Built to connect your diagnostic journey with consultations and health records.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg" asChild>
          <Link href="/health-plans">View Health Plans</Link>
        </Button>
      </div>
    </div>
  );
}
