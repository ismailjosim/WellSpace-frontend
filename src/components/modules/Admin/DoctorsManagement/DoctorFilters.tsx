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
import { Input } from "@/components/ui/input";
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
import { useEffect, useState, useTransition } from "react";
import { ISpecialty } from "@/types/specialties.interface";
import { useDebounce } from "../../../hooks/useDebounce";

interface DoctorsFilterProps {
  specialties: ISpecialty[];
}

const DoctorFilters = ({ specialties }: DoctorsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const urlGender = searchParams.get("gender") || "";
  const urlEmail = searchParams.get("email") || "";
  const urlContact = searchParams.get("contactNumber") || "";
  const urlSearchTerm = searchParams.get("searchTerm") || "";

  // ?specialty=Cardiology&specialty=Dermatology
  const [localSpecialties, setLocalSpecialties] = useState<string[]>(
    () => searchParams.getAll("specialties") || [],
  );
  const [genderInput, setGenderInput] = useState(urlGender);
  const [emailInput, setEmailInput] = useState(urlEmail);
  const [contactNumberInput, setContactNumberInput] = useState(urlContact);

  // Synchronize local states when searchParams change externally (e.g. Clear Filters)
  useEffect(() => {
    setLocalSpecialties(searchParams.getAll("specialties") || []);
    setGenderInput(urlGender);
    setEmailInput(urlEmail);
    setContactNumberInput(urlContact);
  }, [searchParams, urlGender, urlEmail, urlContact]);

  const debouncedGender = useDebounce(genderInput, 300);
  const debouncedEmail = useDebounce(emailInput, 500);
  const debouncedContactNumber = useDebounce(contactNumberInput, 500);

  // Update URL only when debounced inputs differ from URL params
  useEffect(() => {
    if (
      debouncedGender === urlGender &&
      debouncedEmail === urlEmail &&
      debouncedContactNumber === urlContact
    ) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedGender) {
      params.set("gender", debouncedGender);
    } else {
      params.delete("gender");
    }

    if (debouncedEmail) {
      params.set("email", debouncedEmail);
    } else {
      params.delete("email");
    }

    if (debouncedContactNumber) {
      params.set("contactNumber", debouncedContactNumber);
    } else {
      params.delete("contactNumber");
    }

    params.delete("page");

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `?${qs}` : pathname);
    });
  }, [debouncedGender, debouncedEmail, debouncedContactNumber, urlGender, urlEmail, urlContact, searchParams, router, pathname]);

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

  const clearAllFilters = () => {
    setGenderInput("");
    setEmailInput("");
    setContactNumberInput("");
    setLocalSpecialties([]);
    startTransition(() => {
      router.push(pathname);
    });
  };

  const activeFiltersCount =
    localSpecialties.length +
    (genderInput ? 1 : 0) +
    (emailInput ? 1 : 0) +
    (contactNumberInput ? 1 : 0) +
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-60 justify-between h-10"
            >
              <Filter className="mr-2 h-4 w-4" />
              {localSpecialties.length > 0
                ? `${localSpecialties.length} selected`
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
          value={genderInput || "all"}
          onValueChange={(value) =>
            setGenderInput(value === "all" ? "" : value)
          }
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
        <div className="relative">
          <Input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="w-50 h-10 pr-8"
            disabled={isPending}
          />
          {emailInput && (
            <button
              type="button"
              onClick={() => setEmailInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full cursor-pointer"
              aria-label="Clear email filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Contact Number Filter */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Contact"
            value={contactNumberInput}
            onChange={(e) => setContactNumberInput(e.target.value)}
            className="w-40 h-10 pr-8"
            disabled={isPending}
          />
          {contactNumberInput && (
            <button
              type="button"
              onClick={() => setContactNumberInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full cursor-pointer"
              aria-label="Clear contact filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

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
      {localSpecialties.length > 0 && (
        <div className="min-h-8 flex items-center">
          <div className="flex flex-wrap gap-2">
            {localSpecialties.map((specialtyTitle) => (
              <Badge
                key={specialtyTitle}
                variant="outline"
                className="px-2.5 py-1 h-7"
              >
                {specialtyTitle}
                <Button
                  variant="ghost"
                  onClick={() => {
                    const updated = localSpecialties.filter((t) => t !== specialtyTitle);
                    setLocalSpecialties(updated);
                    const params = new URLSearchParams(searchParams.toString());
                    params.delete("specialties");
                    updated.forEach((val) => params.append("specialties", val));
                    params.delete("page");
                    startTransition(() => {
                      const qs = params.toString();
                      router.push(qs ? `?${qs}` : pathname);
                    });
                  }}
                  className="ml-1.5 hover:text-destructive transition-colors p-0 h-auto"
                  aria-label={`Remove ${specialtyTitle}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorFilters;
