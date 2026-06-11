import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Building2, Globe, HandHeart, Heart, Users } from "lucide-react";

export const dynamic = "force-static";

const ngoCategories = [
  { icon: Heart, title: "Health & Wellness", description: "Medical camps and health education.", count: "25+ NGOs" },
  { icon: HandHeart, title: "Patient Support", description: "Financial aid and support for critical patients.", count: "15+ NGOs" },
  { icon: Users, title: "Community Health", description: "Grassroots healthcare in underserved areas.", count: "30+ NGOs" },
  { icon: Building2, title: "Medical Facilities", description: "Free clinics and community hospitals.", count: "20+ organizations" },
  { icon: Award, title: "Medical Research", description: "Groups funding medical research and innovation.", count: "10+ institutions" },
  { icon: Globe, title: "International Aid", description: "Global health organizations working locally.", count: "12+ NGOs" },
];

export default function NGOsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <Badge className="mb-4" variant="outline">Coming Soon</Badge>
        <h1 className="text-4xl font-bold text-primary mb-4">Healthcare NGOs & Organizations</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with healthcare NGOs providing free or subsidized medical services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {ngoCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card key={category.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{category.count}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20 mb-12">
        <CardContent className="p-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">How The NGO Network Will Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Find Support", "Get Assistance", "Join Programs", "Make a Difference"].map((step, index) => (
                <div key={step} className="flex gap-3">
                  <div className="shrink-0 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{step}</h3>
                    <p className="text-sm text-muted-foreground">
                      Discover community support resources and healthcare access programs.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Partner With Us</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Healthcare NGOs will be able to register and reach more people through WellSpace.
          </p>
          <Button size="lg" variant="outline">Register Your NGO</Button>
        </CardContent>
      </Card>
    </div>
  );
}
