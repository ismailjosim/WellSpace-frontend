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

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../../ui/textarea";
import {
  AISuggestionResult,
  fetchAIDoctorSuggestion,
} from "@/lib/ai-suggestion-client";

export default function AIDoctorSuggestion() {
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
    <Card className="bg-linear-to-br from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>AI Doctor Suggestion</CardTitle>
        </div>
        <CardDescription>
          Describe your symptoms and get AI-powered doctor specialty
          recommendations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Describe your symptoms in detail (e.g., headache, fever, cough, etc.)..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            className="resize-none bg-background"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {symptoms.length} characters
          </p>
        </div>

        <Button
          onClick={handleGetSuggestion}
          disabled={isLoading || symptoms.trim().length < 5}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting AI Suggestion...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Get AI Recommendation
            </>
          )}
        </Button>

        {showSuggestion && suggestion && (
          <div className="space-y-3 p-4 bg-background rounded-lg border">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                AI Recommendation
              </Badge>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {suggestion.reasoning || "Recommended doctors based on your symptoms."}
              </p>
              {suggestion.recommendedDoctors &&
                suggestion.recommendedDoctors.length > 0 && (
                  <div className="grid gap-2">
                    {suggestion.recommendedDoctors.slice(0, 3).map((doctor) => (
                      <div
                        key={doctor.id || doctor.name}
                        className="rounded-md border bg-card p-3"
                      >
                        <p className="font-medium">{doctor.name || "Doctor"}</p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.designation || doctor.qualification || "Specialist"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
