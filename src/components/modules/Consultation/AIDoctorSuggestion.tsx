"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Loader2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Textarea } from "../../ui/textarea";
import {
  AISuggestionResult,
  fetchAIDoctorSuggestion,
} from "@/lib/ai-suggestion-client";

export default function AIDoctorSuggestion() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<AISuggestionResult | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const handleGetSuggestion = async () => {
    if (!symptoms.trim() || symptoms.trim().length < 5) {
      toast.error("Please describe your symptoms (at least 5 characters)");
      return;
    }

    setIsLoading(true);
    setSuggestion(null);
    setShowSuggestion(false);

    try {
      const response = await fetchAIDoctorSuggestion(symptoms);
      setSuggestion(response);
      setShowSuggestion(true);
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to get AI suggestion",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-card to-cyan-500/5 shadow-lg overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                AI Diagnostic Specialist Matcher
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Describe your symptoms in plain language to get intelligent doctor recommendations
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="hidden sm:inline-flex rounded-full text-[11px] font-semibold text-primary border-primary/30 bg-primary/5">
            MedMatch™ AI
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Textarea
            placeholder="e.g. sharp knee pain after jogging, accompanied by slight swelling and stiffness in mornings..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
            className="resize-none rounded-2xl border-border/80 bg-background/80 text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
            <span>Minimum 5 characters for clinical relevance</span>
            <span>{symptoms.length} characters</span>
          </div>
        </div>

        <Button
          onClick={handleGetSuggestion}
          disabled={isLoading || symptoms.trim().length < 5}
          className="w-full rounded-xl py-5 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Recommendation
            </>
          )}
        </Button>

        {showSuggestion && suggestion && (
          <div className="space-y-3.5 p-5 bg-card/90 rounded-2xl border border-primary/30 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/25 font-semibold text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  AI Clinical Insights
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground">High Confidence Match</span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed bg-accent/30 p-3.5 rounded-xl border border-border/40">
              {suggestion.reasoning ||
                "Based on the reported symptoms, these specialized doctors match your care requirements."}
            </p>

            {suggestion.recommendedDoctors &&
              suggestion.recommendedDoctors.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recommended Specialists:
                  </p>
                  <div className="grid gap-2">
                    {suggestion.recommendedDoctors.slice(0, 3).map((doctor) => (
                      <div
                        key={doctor.id || doctor.name}
                        onClick={() => {
                          if (doctor.id) {
                            router.push(`/consultation/doctor/${doctor.id}`);
                          } else {
                            router.push(
                              `/consultation?searchTerm=${encodeURIComponent(doctor.name || "")}`,
                            );
                          }
                        }}
                        className="rounded-xl border border-border/70 bg-card p-3 flex items-center justify-between cursor-pointer hover:border-primary/50 hover:bg-primary/5 hover:shadow-xs transition-all group"
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                            {doctor.name || "Doctor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doctor.designation ||
                              doctor.qualification ||
                              "Medical Specialist"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <span>View Profile</span>
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
