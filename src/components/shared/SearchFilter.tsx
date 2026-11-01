"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { useDebounce } from "../hooks/useDebounce";

interface SearchFilterProps {
  placeholder?: string;
  paramName?: string;
}

const SearchFilter = ({
  placeholder = "Search...",
  paramName = "searchTerm",
}: SearchFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const urlParamValue = searchParams.get(paramName) || "";

  const [value, setValue] = useState(urlParamValue);
  const [prevUrlValue, setPrevUrlValue] = useState(urlParamValue);

  // Synchronize internal state when URL search param changes externally (e.g. Clear Filters)
  // Recommended React pattern: update during render instead of inside an effect to prevent cascading renders
  if (urlParamValue !== prevUrlValue) {
    setPrevUrlValue(urlParamValue);
    setValue(urlParamValue);
  }

  const debouncedValue = useDebounce(value, 500);

  // Push to URL only when debouncedValue differs from what is in the URL
  useEffect(() => {
    if (debouncedValue === urlParamValue) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue) {
      params.set(paramName, debouncedValue);
      params.set("page", "1");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  }, [debouncedValue, paramName, router, searchParams, urlParamValue, pathname]);

  const handleClearSingle = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramName);
    params.delete("page");
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
      {value && (
        <button
          type="button"
          onClick={handleClearSingle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full cursor-pointer"
          aria-label={`Clear ${placeholder}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
