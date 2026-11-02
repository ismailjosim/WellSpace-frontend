"use client";

import { useActionState, useEffect, useRef } from "react";
import InputFieldError from "@/components/shared/InputFieldError";
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
  createSpecialty,
  updateSpecialty,
} from "@/services/admin/specialtiesManagement";
import { toast } from "sonner";
import { ISpecialty } from "@/types/specialties.interface";
import Image from "next/image";

interface SpecialtiesFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  specialty?: ISpecialty | null;
}

const SpecialtiesFormDialog = ({
  open,
  onClose,
  onSuccess,
  specialty,
}: SpecialtiesFormDialogProps) => {
  const isEdit = !!specialty;
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateSpecialty.bind(null, specialty.id) : createSpecialty,
    null,
  );
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (state?.success && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.success(state.message);
      if (formRef.current) {
        formRef.current.reset();
      }
      onSuccess();
      onClose();
    } else if (state && !state.success && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.error(state.message);
    }
  }, [state, onClose, onSuccess]);

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Specialty" : "Add New Specialty"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              defaultValue={specialty?.title || ""}
              placeholder="e.g. Cardiology"
              required
            />
            <InputFieldError field="title" state={state} />
          </Field>

          <Field>
            <FieldLabel htmlFor="file">
              {isEdit ? "Update Icon (Optional)" : "Upload Icon"}
            </FieldLabel>

            {isEdit && specialty?.icon && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/40 border border-border/50 mb-2">
                <Image
                  src={specialty.icon}
                  alt={specialty.title}
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                  unoptimized
                />
                <span className="text-xs text-muted-foreground">
                  Current icon. Select a new file below to replace it.
                </span>
              </div>
            )}

            <Input id="file" name="file" type="file" accept="image/*" />
            <InputFieldError field="file" state={state} />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : isEdit
                  ? "Update Specialty"
                  : "Save Specialty"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialtiesFormDialog;
