"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Star,
  Sparkles,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AISuggestionResult,
  fetchAIDoctorSuggestion,
} from "@/lib/ai-suggestion-client";

import slide01 from "@/assets/images/slide-01.jpeg";
import slide02 from "@/assets/images/slide-02.jpeg";
import slide03 from "@/assets/images/slide-03.jpeg";
import slide04 from "@/assets/images/slide-04.jpeg";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [symptoms, setSymptoms] = useState("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestionResult | null>(
    null,
  );
  const [aiError, setAiError] = useState("");

  const backgroundImages = [slide01, slide02, slide03, slide04];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleGetRecommendations = async () => {
    if (symptoms.trim().length < 5) {
      setAiError("Please describe your symptoms with at least 5 characters.");
      setAiSuggestion(null);
      return;
    }

    setIsLoadingSuggestion(true);
    setAiError("");
    setAiSuggestion(null);

    try {
      const response = await fetchAIDoctorSuggestion(symptoms);
      setAiSuggestion(response);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : "Failed to get AI recommendations.",
      );
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] flex justify-center items-center py-16 overflow-hidden bg-background">
      {/* Background Images & Sophisticated 2026 Overlay */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            } transition-transform duration-10000`}
          >
            <Image
              src={image}
              alt={`Clinical Background ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="w-full h-full object-cover"
            />
            {/* Ambient Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.3)_0%,transparent_60%)]" />
          </div>
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Calls to Action */}
          <div className="lg:col-span-7 space-y-6 text-white">
            {/* 2026 Status Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs max-w-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-teal-200 uppercase">
                AI Telehealth
              </span>
              <span className="text-white/40">|</span>
              <span className="text-[11px] sm:text-xs text-white/90 font-medium truncate">
                Instant Video Consults
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Next-Gen Healthcare,{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-sky-300 bg-clip-text text-transparent">
                Connected by AI
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-xl leading-relaxed">
              Experience modern clinical care without delays. Describe your
              symptoms, match with top-rated board-certified specialists, and
              consult via encrypted HD video in minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto">
              <Link href="/consultation" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-6 py-5 sm:px-7 sm:py-6 text-sm sm:text-base font-semibold bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-600 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                  Find Your Specialist
                </Button>
              </Link>

              <Link href="/consultation" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-6 py-5 sm:px-7 sm:py-6 text-sm sm:text-base font-semibold bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-md transition-all duration-300 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                  Book Appointment
                </Button>
              </Link>
            </div>

            {/* Verified Trust Badges */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-6 max-w-lg">
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-white">
                  50K+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5">
                  Patients Served
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-extrabold text-white">
                  1,000+
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5">
                  Verified Doctors
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl sm:text-3xl font-extrabold text-white">
                    4.9
                  </span>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300/80 mt-0.5">
                  Rating (12k+)
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 2026 AI Doctor Finder Glass Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Card className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/60 backdrop-blur-2xl shadow-2xl text-white overflow-hidden p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white">
                      AI Doctor Match
                    </CardTitle>
                    <p className="text-[11px] text-teal-300/80 font-medium">
                      MedMatch™ Clinical Engine
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Online
                </span>
              </div>

              <CardContent className="p-0 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold tracking-wide text-slate-200">
                    What symptoms are you experiencing?
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. persistent migraine, fever, joint pain..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 backdrop-blur-md"
                  />
                </div>

                <Button
                  size="lg"
                  onClick={handleGetRecommendations}
                  disabled={isLoadingSuggestion || symptoms.trim().length < 5}
                  className="w-full py-5 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md shadow-cyan-500/25 transition-all duration-300"
                >
                  {isLoadingSuggestion ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Clinical Data...
                    </>
                  ) : (
                    <>
                      <span>Match Specialists with AI</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* AI Recommendation Result Box */}
                {(aiError || aiSuggestion) && (
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md space-y-3">
                    {aiError ? (
                      <p className="text-xs text-rose-200 font-medium">
                        {aiError}
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-xs text-teal-200 font-medium flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                          <span>AI Assessment Complete</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
                          {aiSuggestion?.reasoning ||
                            "Based on your symptoms, we matched recommended medical specialists."}
                        </p>
                        {aiSuggestion?.recommendedDoctors &&
                          aiSuggestion.recommendedDoctors.length > 0 && (
                            <div className="grid gap-2 pt-1">
                              {aiSuggestion.recommendedDoctors
                                .slice(0, 2)
                                .map((doctor) => (
                                  <div
                                    key={doctor.id || doctor.name}
                                    className="flex items-center justify-between rounded-xl bg-white/15 px-3 py-2 border border-white/10"
                                  >
                                    <div>
                                      <p className="text-xs font-bold text-white">
                                        {doctor.name || "Specialist"}
                                      </p>
                                      <p className="text-[11px] text-teal-200">
                                        {doctor.designation ||
                                          doctor.qualification ||
                                          "Specialist"}
                                      </p>
                                    </div>
                                    <Link href="/consultation">
                                      <span className="text-[11px] font-semibold text-white hover:text-teal-200 underline">
                                        View
                                      </span>
                                    </Link>
                                  </div>
                                ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300/80 pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300 shrink-0" />
                  <span>
                    Clinical privacy preserved. Zero diagnostic data stored.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2.5 bg-cyan-400 shadow-sm shadow-cyan-400/50"
                : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
