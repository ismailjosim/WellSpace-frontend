"use client";

import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Check, ChevronsUpDown, Filter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ISpecialty } from "@/types/specialties.interface";

interface DoctorsFilterProps {
  specialties: ISpecialty[];
}

const DoctorFilters = ({ specialties }: DoctorsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const urlSpecialties = searchParams.getAll("specialties") || [];
  const urlGender = searchParams.get("gender") || "";
  const urlEmail = searchParams.get("email") || "";
  const urlContact = searchParams.get("contactNumber") || "";
  const urlSearchTerm = searchParams.get("searchTerm") || "";

  // Local state for popover multi-select staging
  const [localSpecialties, setLocalSpecialties] =
    useState<string[]>(urlSpecialties);
  const [prevUrlSpecialtiesKey, setPrevUrlSpecialtiesKey] = useState(
    urlSpecialties.join(","),
  );

  const currentUrlSpecialtiesKey = urlSpecialties.join(",");
  if (currentUrlSpecialtiesKey !== prevUrlSpecialtiesKey) {
    setPrevUrlSpecialtiesKey(currentUrlSpecialtiesKey);
    setLocalSpecialties(urlSpecialties);
  }

  const handleGenderChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete("gender");
    } else {
      params.set("gender", value);
    }
    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  };

  const toggleSpecialty = (specialtyTitle: string) => {
    const newSelection = localSpecialties.includes(specialtyTitle)
      ? localSpecialties.filter((id) => id !== specialtyTitle)
      : [...localSpecialties, specialtyTitle];

    setLocalSpecialties(newSelection);
  };

  const applySpecialtyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("specialties");
    if (localSpecialties.length > 0) {
      localSpecialties.forEach((val) => params.append("specialties", val));
    }
    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
    setOpen(false);
  };

  const removeSpecialtyBadge = (specialtyTitle: string) => {
    const updated = urlSpecialties.filter((t) => t !== specialtyTitle);
    setLocalSpecialties(updated);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("specialties");
    updated.forEach((val) => params.append("specialties", val));
    params.delete("page");
    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  };

  const clearAllFilters = () => {
    setLocalSpecialties([]);
    startTransition(() => {
      router.push(pathname);
    });
  };

  const activeFiltersCount =
    urlSpecialties.length +
    (urlGender ? 1 : 0) +
    (urlEmail ? 1 : 0) +
    (urlContact ? 1 : 0) +
    (urlSearchTerm ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Row 1: Search and Refresh */}
      <div className="flex items-center gap-3">
        <SearchFilter paramName="searchTerm" placeholder="Search doctors..." />
        <RefreshButton />
      </div>

      {/* Row 2: Filter Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Specialties Multi-Select */}
        <Popover
          open={open}
          onOpenChange={(newOpen) => {
            if (newOpen) {
              setLocalSpecialties(urlSpecialties);
            }
            setOpen(newOpen);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-60 justify-between h-10"
            >
              <Filter className="mr-2 h-4 w-4" />
              {urlSpecialties.length > 0
                ? `${urlSpecialties.length} selected`
                : "Select specialties"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search specialties..." />
              <CommandList>
                <CommandEmpty>No specialty found.</CommandEmpty>
                <CommandGroup>
                  {specialties.map((specialty) => {
                    const isSelected = localSpecialties.includes(
                      specialty.title,
                    );
                    return (
                      <CommandItem
                        key={specialty.id}
                        value={specialty.title}
                        onSelect={() => toggleSpecialty(specialty.title)}
                        className={isSelected ? "bg-accent" : ""}
                      >
                        <Checkbox checked={isSelected} className="mr-2" />
                        <span className={isSelected ? "font-medium" : ""}>
                          {specialty.title}
                        </span>
                        {isSelected && (
                          <Check className="ml-auto h-4 w-4 text-primary" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
              <div className="p-2 border-t">
                <Button
                  onClick={applySpecialtyFilter}
                  className="w-full"
                  size="sm"
                  disabled={isPending}
                >
                  Apply Filter
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Gender Filter */}
        <Select
          value={urlGender || "all"}
          onValueChange={handleGenderChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-35 h-10">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genders</SelectItem>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
          </SelectContent>
        </Select>

        {/* Email Filter */}
        <SearchFilter paramName="email" placeholder="Email" />

        {/* Contact Number Filter */}
        <SearchFilter paramName="contactNumber" placeholder="Contact" />

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            disabled={isPending}
            className="h-10 px-3"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Row 3: Active Specialty Badges */}
      {urlSpecialties.length > 0 && (
        <div className="min-h-8 flex items-center">
          <div className="flex flex-wrap gap-2">
            {urlSpecialties.map((specialtyTitle) => (
              <Badge
                key={specialtyTitle}
                variant="outline"
                className="px-2.5 py-1 h-7"
              >
                {specialtyTitle}
                <button
                  type="button"
                  onClick={() => removeSpecialtyBadge(specialtyTitle)}
                  className="ml-1.5 hover:text-destructive transition-colors p-0 h-auto cursor-pointer inline-flex items-center"
                  aria-label={`Remove ${specialtyTitle}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorFilters;
