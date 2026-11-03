import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdvancedDoctorFiltersProps = {
  searchParams: Pick<URLSearchParams, "get">;
  minFee: string;
  maxFee: string;
  setMinFee: (value: string) => void;
  setMaxFee: (value: string) => void;
  updateFilters: (updates: Record<string, string | null>) => void;
  onApplyFee: () => void;
  onFeePreset: (min: string | null, max: string | null) => void;
};

export default function AdvancedDoctorFilters({
  searchParams,
  minFee,
  maxFee,
  setMinFee,
  setMaxFee,
  updateFilters,
  onApplyFee,
  onFeePreset,
}: AdvancedDoctorFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t pt-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Gender
        </label>
        <Select
          value={searchParams.get("gender") || "all"}
          onValueChange={(value) => updateFilters({ gender: value })}
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

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Minimum Rating
        </label>
        <Select
          value={searchParams.get("minRating") || "all"}
          onValueChange={(value) => updateFilters({ minRating: value })}
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

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Experience Level
        </label>
        <Select
          value={searchParams.get("minExperience") || "all"}
          onValueChange={(value) => updateFilters({ minExperience: value })}
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

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Fee Range (৳)
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minFee}
            onChange={(event) => setMinFee(event.target.value)}
            className="h-9"
          />
          <span className="text-xs text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxFee}
            onChange={(event) => setMaxFee(event.target.value)}
            className="h-9"
          />
          <Button size="sm" onClick={onApplyFee} className="h-9">
            Apply
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => onFeePreset(null, "1000")}
            className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            &lt; ৳1,000
          </button>
          <button
            type="button"
            onClick={() => onFeePreset("1000", "2000")}
            className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            ৳1k - ৳2k
          </button>
          <button
            type="button"
            onClick={() => onFeePreset("2000", null)}
            className="rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          >
            &gt; ৳2,000
          </button>
        </div>
      </div>
    </div>
  );
}
