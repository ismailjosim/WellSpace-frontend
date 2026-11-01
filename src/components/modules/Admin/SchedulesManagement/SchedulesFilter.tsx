"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/components/hooks/useDebounce";

const SchedulesFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlStartDate = searchParams.get("startDate") || "";
  const urlEndDate = searchParams.get("endDate") || "";

  // Local state for inputs with debouncing
  const [startDateInput, setStartDateInput] = useState(urlStartDate);
  const [endDateInput, setEndDateInput] = useState(urlEndDate);

  // Synchronize local input state whenever URL search params change externally (e.g. Clear Filters)
  useEffect(() => {
    setStartDateInput(urlStartDate);
  }, [urlStartDate]);

  useEffect(() => {
    setEndDateInput(urlEndDate);
  }, [urlEndDate]);

  // Debounced values
  const debouncedStartDate = useDebounce(startDateInput, 500);
  const debouncedEndDate = useDebounce(endDateInput, 500);

  // Apply debounced filters to URL only when different from current URL
  useEffect(() => {
    if (debouncedStartDate === urlStartDate && debouncedEndDate === urlEndDate) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedStartDate) {
      params.set("startDate", debouncedStartDate);
    } else {
      params.delete("startDate");
    }

    if (debouncedEndDate) {
      params.set("endDate", debouncedEndDate);
    } else {
      params.delete("endDate");
    }

    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  }, [debouncedStartDate, debouncedEndDate, urlStartDate, urlEndDate, searchParams, router, pathname]);

  return (
    <div className="space-y-3">
      {/* Row 1: Filters and Refresh */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Start Date Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm font-medium text-muted-foreground">
            Start Date:
          </label>
          <Input
            id="startDate"
            type="date"
            value={startDateInput}
            onChange={(e) => setStartDateInput(e.target.value)}
            className="w-40 h-10"
            disabled={isPending}
          />
        </div>

        {/* End Date Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-sm font-medium text-muted-foreground">
            End Date:
          </label>
          <Input
            id="endDate"
            type="date"
            value={endDateInput}
            onChange={(e) => setEndDateInput(e.target.value)}
            className="w-40 h-10"
            disabled={isPending}
          />
        </div>

        <RefreshButton />

        {/* Clear Filters */}
        <ClearFiltersButton />
      </div>
    </div>
  );
};

export default SchedulesFilter;
