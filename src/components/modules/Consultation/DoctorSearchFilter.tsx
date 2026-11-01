"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

interface DoctorSearchFiltersProps {
  specialties: Array<{ id: string; title: string }>;
}

export default function DoctorSearchFilters({
  specialties,
}: DoctorSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const urlMinFee = searchParams.get("minFee") || "";
  const urlMaxFee = searchParams.get("maxFee") || "";

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);
  const [prevUrlSearchTerm, setPrevUrlSearchTerm] = useState(urlSearchTerm);

  if (urlSearchTerm !== prevUrlSearchTerm) {
    setPrevUrlSearchTerm(urlSearchTerm);
    setSearchTerm(urlSearchTerm);
  }

  const [minFee, setMinFee] = useState(urlMinFee);
  const [prevUrlMinFee, setPrevUrlMinFee] = useState(urlMinFee);

  if (urlMinFee !== prevUrlMinFee) {
    setPrevUrlMinFee(urlMinFee);
    setMinFee(urlMinFee);
  }

  const [maxFee, setMaxFee] = useState(urlMaxFee);
  const [prevUrlMaxFee, setPrevUrlMaxFee] = useState(urlMaxFee);

  if (urlMaxFee !== prevUrlMaxFee) {
    setPrevUrlMaxFee(urlMaxFee);
    setMaxFee(urlMaxFee);
  }

  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const updateFilters = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `/consultation?${qs}` : "/consultation");
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== urlSearchTerm) {
      updateFilters({ searchTerm: debouncedSearch });
    }
  }, [debouncedSearch, urlSearchTerm, updateFilters]);

  const handleApplyFee = () => {
    updateFilters({
      minFee: minFee.trim() ? minFee.trim() : null,
      maxFee: maxFee.trim() ? maxFee.trim() : null,
    });
  };

  const handleFeePreset = (min: string | null, max: string | null) => {
    setMinFee(min || "");
    setMaxFee(max || "");
    updateFilters({ minFee: min, maxFee: max });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setMinFee("");
    setMaxFee("");
    router.push("/consultation");
  };

  const hasActiveFilters = Boolean(
    searchParams.get("searchTerm") ||
    searchParams.get("specialties") ||
    searchParams.get("gender") ||
    searchParams.get("minFee") ||
    searchParams.get("maxFee") ||
    searchParams.get("minRating") ||
    searchParams.get("minExperience") ||
    searchParams.get("sortBy"),
  );

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-xs">
      {/* Primary search bar & specialty */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors by name, qualification, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Specialty Filter */}
        <Select
          value={searchParams.get("specialties") || "all"}
          onValueChange={(val) => updateFilters({ specialties: val })}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue placeholder="All Specialties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {specialties.map((spec) => (
              <SelectItem key={spec.id} value={spec.title}>
                {spec.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort By Filter */}
        <Select
          value={
            searchParams.get("sortBy")
              ? `${searchParams.get("sortBy")}_${searchParams.get("sortOrder") || "desc"}`
              : "default"
          }
          onValueChange={(val) => {
            if (val === "default") {
              updateFilters({ sortBy: null, sortOrder: null });
            } else if (val === "rating_desc") {
              updateFilters({ sortBy: "averageRating", sortOrder: "desc" });
            } else if (val === "fee_asc") {
              updateFilters({ sortBy: "appointmentFee", sortOrder: "asc" });
            } else if (val === "fee_desc") {
              updateFilters({ sortBy: "appointmentFee", sortOrder: "desc" });
            } else if (val === "exp_desc") {
              updateFilters({ sortBy: "experience", sortOrder: "desc" });
            }
          }}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default Sorting</SelectItem>
            <SelectItem value="rating_desc">⭐ Top Rated</SelectItem>
            <SelectItem value="fee_asc">Fee: Low to High</SelectItem>
            <SelectItem value="fee_desc">Fee: High to Low</SelectItem>
            <SelectItem value="exp_desc">Most Experienced</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle Advanced Filters Button */}
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filter Panel */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t">
          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gender
            </label>
            <Select
              value={searchParams.get("gender") || "all"}
              onValueChange={(val) => updateFilters({ gender: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Gender</SelectItem>
                <SelectItem value="MALE">Male Doctors</SelectItem>
                <SelectItem value="FEMALE">Female Doctors</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Min Rating */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Minimum Rating
            </label>
            <Select
              value={searchParams.get("minRating") || "all"}
              onValueChange={(val) => updateFilters({ minRating: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="4.5">4.5+ Stars (Excellent)</SelectItem>
                <SelectItem value="4.0">4.0+ Stars (Very Good)</SelectItem>
                <SelectItem value="3.5">3.5+ Stars (Good)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Minimum Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Experience Level
            </label>
            <Select
              value={searchParams.get("minExperience") || "all"}
              onValueChange={(val) => updateFilters({ minExperience: val })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Experience</SelectItem>
                <SelectItem value="3">3+ Years</SelectItem>
                <SelectItem value="5">5+ Years</SelectItem>
                <SelectItem value="10">10+ Years (Senior)</SelectItem>
                <SelectItem value="15">15+ Years (Veteran)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Consultation Fee Range */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Fee Range (৳)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minFee}
                onChange={(e) => setMinFee(e.target.value)}
                className="h-9"
              />
              <span className="text-muted-foreground text-xs">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                className="h-9"
              />
              <Button size="sm" onClick={handleApplyFee} className="h-9">
                Apply
              </Button>
            </div>
            {/* Quick Fee Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleFeePreset(null, "1000")}
                className="text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
              >
                &lt; ৳1,000
              </button>
              <button
                type="button"
                onClick={() => handleFeePreset("1000", "2000")}
                className="text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
              >
                ৳1k - ৳2k
              </button>
              <button
                type="button"
                onClick={() => handleFeePreset("2000", null)}
                className="text-[11px] rounded bg-muted px-2 py-0.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
              >
                &gt; ৳2,000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
