"use client";

import ClearFiltersButton from "@/components/shared/ClearFiltersButton";
import RefreshButton from "@/components/shared/RefreshButton";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useDebounce } from "@/components/hooks/useDebounce";

const SchedulesFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlStartDate = searchParams.get("startDate") || "";
  const urlEndDate = searchParams.get("endDate") || "";

  const isUserChangingRef = useRef(false);

  // Local state for inputs with debouncing
  const [startDateInput, setStartDateInput] = useState(urlStartDate);
  const [prevUrlStartDate, setPrevUrlStartDate] = useState(urlStartDate);

  if (urlStartDate !== prevUrlStartDate) {
    setPrevUrlStartDate(urlStartDate);
    setStartDateInput(urlStartDate);
    isUserChangingRef.current = false;
  }

  const [endDateInput, setEndDateInput] = useState(urlEndDate);
  const [prevUrlEndDate, setPrevUrlEndDate] = useState(urlEndDate);

  if (urlEndDate !== prevUrlEndDate) {
    setPrevUrlEndDate(urlEndDate);
    setEndDateInput(urlEndDate);
    isUserChangingRef.current = false;
  }

  // Debounced values
  const debouncedStartDate = useDebounce(startDateInput, 400);
  const debouncedEndDate = useDebounce(endDateInput, 400);

  // Apply debounced filters to URL ONLY when user changed the input
  useEffect(() => {
    if (!isUserChangingRef.current) {
      return;
    }

    isUserChangingRef.current = false;

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
            onChange={(e) => {
              isUserChangingRef.current = true;
              setStartDateInput(e.target.value);
            }}
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
            onChange={(e) => {
              isUserChangingRef.current = true;
              setEndDateInput(e.target.value);
            }}
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
