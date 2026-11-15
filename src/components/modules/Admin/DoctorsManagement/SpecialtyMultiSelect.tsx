"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import CreatableSelect from "react-select/creatable";
import type { StylesConfig } from "react-select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSpecialty } from "@/services/admin/specialtiesManagement";
import { ISpecialty } from "@/types/specialties.interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  isUploadFileTooLarge,
  MAX_UPLOAD_FILE_SIZE_LABEL,
} from "@/lib/formDataHelper";

interface SpecialtyOption {
  value: string;
  label: string;
}

interface SpecialtyMultiSelectProps {
  selectedSpecialtyIds: string[];
  removedSpecialtyIds: string[];
  currentSpecialtyId: string;
  availableSpecialties: ISpecialty[];
  allSpecialties: ISpecialty[];
  isEdit: boolean;
  onCurrentSpecialtyChange: (id: string) => void;
  onAddSpecialty: (id?: string) => void;
  onRemoveSpecialty: (id: string) => void;
  onSpecialtyCreated: (specialty: ISpecialty) => void;
  getSpecialtyTitle: (id: string) => string;
  getNewSpecialties: () => string[];
}

const customStyles: StylesConfig<SpecialtyOption, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "var(--background)",
    borderColor: state.isFocused ? "var(--primary)" : "var(--input)",
    boxShadow: state.isFocused ? "0 0 0 2px var(--ring)" : "none",
    borderRadius: "0.75rem",
    minHeight: "2.5rem",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "var(--primary)" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "var(--popover)",
    borderRadius: "0.75rem",
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "var(--accent)" : "transparent",
    color: state.isFocused ? "var(--accent-foreground)" : "var(--foreground)",
    fontSize: "0.875rem",
  }),
  input: (base) => ({ ...base, color: "var(--foreground)" }),
  placeholder: (base) => ({ ...base, color: "var(--muted-foreground)" }),
  singleValue: (base) => ({ ...base, color: "var(--foreground)" }),
};

const SpecialtyMultiSelect = ({
  selectedSpecialtyIds,
  removedSpecialtyIds,
  currentSpecialtyId,
  availableSpecialties,
  allSpecialties,
  isEdit,
  onCurrentSpecialtyChange,
  onAddSpecialty,
  onRemoveSpecialty,
  onSpecialtyCreated,
  getSpecialtyTitle,
  getNewSpecialties,
}: SpecialtyMultiSelectProps) => {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpecialtyTitle, setNewSpecialtyTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const selectedSpecialty = availableSpecialties.find(
    (specialty) => specialty.id === currentSpecialtyId,
  );
  const selectedOption = selectedSpecialty
    ? { value: selectedSpecialty.id, label: selectedSpecialty.title }
    : null;

  const handleCreateOption = (title: string) => {
    const normalizedTitle = title.trim();
    const existingSpecialty = allSpecialties.find(
      (specialty) =>
        specialty.title.toLowerCase() === normalizedTitle.toLowerCase(),
    );

    if (existingSpecialty) {
      if (!selectedSpecialtyIds.includes(existingSpecialty.id)) {
        onAddSpecialty(existingSpecialty.id);
      } else {
        toast.info("This specialty is already selected.");
      }
      return;
    }

    setNewSpecialtyTitle(normalizedTitle);
    setCreateDialogOpen(true);
  };

  const handleCreateSpecialty = async () => {
    const icon = iconInputRef.current?.files?.[0];

    if (!icon) {
      toast.error("Choose an icon for this specialty.");
      return;
    }

    if (isUploadFileTooLarge(icon)) {
      toast.error(
        `Specialty icon must be ${MAX_UPLOAD_FILE_SIZE_LABEL} or smaller.`,
      );
      return;
    }

    const formData = new FormData();
    formData.set("title", newSpecialtyTitle);
    formData.set("file", icon);

    try {
      setIsCreating(true);
      const result = await createSpecialty(null, formData);
      const specialty = result?.data;

      if (
        !result?.success ||
        typeof specialty?.id !== "string" ||
        typeof specialty?.title !== "string" ||
        typeof specialty?.icon !== "string"
      ) {
        toast.error(result?.message || "Failed to create specialty");
        return;
      }

      onSpecialtyCreated(specialty);
      onAddSpecialty(specialty.id);
      router.refresh();
      setCreateDialogOpen(false);
      setNewSpecialtyTitle("");
      toast.success(`Added ${specialty.title} specialty.`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create specialty",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Field>
        <FieldLabel htmlFor="doctor-specialties" required>
          Specialties
        </FieldLabel>

        <Input
          type="hidden"
          name="specialties"
          value={JSON.stringify(
            isEdit ? getNewSpecialties() : selectedSpecialtyIds,
          )}
        />
        {isEdit && (
          <Input
            type="hidden"
            name="removeSpecialties"
            value={JSON.stringify(removedSpecialtyIds)}
          />
        )}

        {selectedSpecialtyIds.length > 0 && (
          <div className="flex flex-wrap gap-2 rounded-lg bg-muted">
            {selectedSpecialtyIds.map((id) => (
              <span
                key={id}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground"
              >
                {getSpecialtyTitle(id)}
                <button
                  type="button"
                  onClick={() => onRemoveSpecialty(id)}
                  aria-label={`Remove ${getSpecialtyTitle(id)}`}
                  className="font-bold hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {mounted ? (
            <CreatableSelect
              instanceId="doctor-specialties"
              inputId="doctor-specialties"
              value={selectedOption}
              options={availableSpecialties.map((specialty) => ({
                value: specialty.id,
                label: specialty.title,
              }))}
              onChange={(option) =>
                onCurrentSpecialtyChange(option?.value || "")
              }
              onCreateOption={handleCreateOption}
              formatCreateLabel={(inputValue) => `+ Add "${inputValue}"`}
              placeholder="Select or type a new specialty"
              styles={customStyles}
              className="min-w-0 flex-1 text-sm"
              isClearable
            />
          ) : (
            <div className="h-10 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
              Select or type a new specialty
            </div>
          )}
          <Button
            type="button"
            onClick={() => onAddSpecialty()}
            disabled={!currentSpecialtyId}
            variant="outline"
          >
            Add
          </Button>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {isEdit
            ? "Add new specialties or remove existing ones"
            : "Select or create at least one specialty for the doctor"}
        </p>

        {isEdit && (
          <div className="mt-2 space-y-1">
            {getNewSpecialties().length > 0 && (
              <p className="text-xs text-green-600">
                Will add:{" "}
                {getNewSpecialties().map(getSpecialtyTitle).join(", ")}
              </p>
            )}
            {removedSpecialtyIds.length > 0 && (
              <p className="text-xs text-red-600">
                Will remove:{" "}
                {removedSpecialtyIds.map(getSpecialtyTitle).join(", ")}
              </p>
            )}
          </div>
        )}
      </Field>

      <Dialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          if (!isCreating) setCreateDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Specialty</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="new-specialty-title" required>
                Specialty Name
              </FieldLabel>
              <Input
                id="new-specialty-title"
                name="title"
                value={newSpecialtyTitle}
                onChange={(event) => setNewSpecialtyTitle(event.target.value)}
                required
                minLength={3}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="new-specialty-icon" required>
                Specialty Icon
              </FieldLabel>
              <Input
                id="new-specialty-icon"
                name="file"
                type="file"
                accept="image/*"
                required
                ref={iconInputRef}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateSpecialty}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create and Add"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecialtyMultiSelect;
