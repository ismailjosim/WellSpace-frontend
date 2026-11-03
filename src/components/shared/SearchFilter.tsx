"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
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
  const isUserTypingRef = useRef(false);

  // Synchronize internal state when URL search param changes externally (e.g. Clear Filters)
  if (urlParamValue !== prevUrlValue) {
    setPrevUrlValue(urlParamValue);
    setValue(urlParamValue);
  }

  const debouncedValue = useDebounce(value, 400);

  // Push to URL ONLY when the change originated from the user typing in this input
  useEffect(() => {
    if (debouncedValue === urlParamValue) {
      isUserTypingRef.current = false;
      return;
    }

    if (!isUserTypingRef.current) {
      return;
    }

    isUserTypingRef.current = false;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue.trim()) {
      params.set(paramName, debouncedValue.trim());
      params.delete("page");
    } else {
      params.delete(paramName);
      params.delete("page");
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  }, [
    debouncedValue,
    paramName,
    router,
    searchParams,
    urlParamValue,
    pathname,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    setValue(e.target.value);
  };

  const handleClearSingle = () => {
    isUserTypingRef.current = false;
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
        onChange={handleInputChange}
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
