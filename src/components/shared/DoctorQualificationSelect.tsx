"use client";

import { useState, useSyncExternalStore } from "react";
import CreatableSelect from "react-select/creatable";
import type { StylesConfig } from "react-select";
import { doctorQualificationOptions } from "@/constants/doctorQualifications";

export interface QualificationOption {
  value: string;
  label: string;
}

interface DoctorQualificationSelectProps {
  id?: string;
  name?: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export default function DoctorQualificationSelect({
  id = "qualification",
  name = "qualification",
  defaultValue = "",
  disabled = false,
  placeholder = "Select or type qualifications (e.g. MBBS, MD)...",
  onChange,
}: DoctorQualificationSelectProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Parse comma-separated defaultValue into QualificationOption[]
  const parseDefault = (val: string): QualificationOption[] => {
    if (!val || typeof val !== "string") return [];
    return val
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ value: item, label: item }));
  };

  const [selectedOptions, setSelectedOptions] = useState<QualificationOption[]>(
    () => parseDefault(defaultValue),
  );
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue);

  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue);
    setSelectedOptions(parseDefault(defaultValue));
  }

  const serializedValue = selectedOptions.map((opt) => opt.value).join(", ");

  const handleChange = (newValue: readonly QualificationOption[]) => {
    const updated = Array.from(newValue);
    setSelectedOptions(updated);
    const joined = updated.map((opt) => opt.value).join(", ");
    onChange?.(joined);
  };

  const customStyles: StylesConfig<QualificationOption, true> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "var(--background)",
      borderColor: state.isFocused ? "var(--primary)" : "var(--input)",
      boxShadow: state.isFocused ? "0 0 0 2px var(--ring)" : "none",
      borderRadius: "0.75rem",
      minHeight: "2.5rem",
      fontSize: "0.875rem",
      transition: "all 0.15s ease",
      "&:hover": {
        borderColor: "var(--primary)",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "var(--popover)",
      borderColor: "var(--border)",
      borderRadius: "0.75rem",
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
      zIndex: 9999,
      padding: "0.25rem",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "14rem",
      padding: "0.25rem",
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
          ? "var(--accent)"
          : "transparent",
      color: state.isSelected
        ? "var(--primary-foreground)"
        : state.isFocused
          ? "var(--accent-foreground)"
          : "var(--foreground)",
      "&:active": {
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "var(--accent)",
      borderRadius: "0.375rem",
      padding: "0.1rem 0.25rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "var(--accent-foreground)",
      fontSize: "0.75rem",
      fontWeight: 600,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "var(--muted-foreground)",
      borderRadius: "0.25rem",
      "&:hover": {
        backgroundColor: "var(--destructive)",
        color: "var(--destructive-foreground)",
      },
    }),
    input: (base) => ({
      ...base,
      color: "var(--foreground)",
    }),
    placeholder: (base) => ({
      ...base,
      color: "var(--muted-foreground)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "var(--foreground)",
    }),
  };

  return (
    <div className="relative w-full">
      {/* Hidden input to ensure native form submission (FormData) works seamlessly */}
      <input type="hidden" id={id} name={name} value={serializedValue} />

      {mounted ? (
        <CreatableSelect
          instanceId={id}
          isMulti
          options={doctorQualificationOptions}
          value={selectedOptions}
          onChange={handleChange}
          isDisabled={disabled}
          placeholder={placeholder}
          formatCreateLabel={(inputValue) => `+ Add "${inputValue}"`}
          styles={customStyles}
          className="text-sm"
        />
      ) : (
        <div className="h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center">
          {serializedValue || placeholder}
        </div>
      )}
    </div>
  );
}
