"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IDoctor } from "@/types/doctor.interface";
import { ISpecialty } from "@/types/specialties.interface";
import { useActionState, useEffect, useRef, useState } from "react";
import { createDoctor, updateDoctor } from "@/services/admin/doctorsManagement";
import { toast } from "sonner";
import { useSpecialtySelection } from "@/components/hooks/specialtyHooks/useSpecialtySelection";
import SpecialtyMultiSelect from "./SpecialtyMultiSelect";
import { Eye, EyeOff } from "lucide-react";
import DoctorQualificationSelect from "@/components/shared/DoctorQualificationSelect";

interface IDoctorFormDialogInterface {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor?: IDoctor;
  specialties?: ISpecialty[];
}

const DoctorFormDialog = ({
  open,
  onClose,
  onSuccess,
  doctor,
  specialties,
}: IDoctorFormDialogInterface) => {
  const isEdit = !!doctor;

  const [gender, setGender] = useState<"MALE" | "FEMALE">(
    doctor?.gender || "MALE",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [state, formAction, pending] = useActionState(
    isEdit ? updateDoctor.bind(null, doctor.id!) : createDoctor,
    null,
  );
  const prevStateRef = useRef<unknown>(null);

  const specialtySelection = useSpecialtySelection({
    doctor,
    isEdit,
    open,
  });

  const getSpecialtyTitle = (id: string): string => {
    return specialties?.find((s) => s.id === id)?.title || "Unknown";
  };

  useEffect(() => {
    if (!state || state === prevStateRef.current) return;
    prevStateRef.current = state;

    if (state.success) {
      toast.success(
        state.message ||
          (isEdit
            ? "Doctor updated successfully"
            : "Doctor created successfully"),
      );
      onSuccess();
      onClose();
    } else {
      toast.error(state.message || "Failed to save doctor");
    }
  }, [state, isEdit, onClose, onSuccess]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{isEdit ? "Edit Doctor" : "Add New Doctor"}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Dr. John Doe"
                defaultValue={isEdit ? doctor?.name : undefined}
              />
              <InputFieldError state={state} field="name" />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@example.com"
                defaultValue={isEdit ? doctor?.email : undefined}
                disabled={isEdit}
              />
              <InputFieldError state={state} field="email" />
            </Field>

            {!isEdit && (
              <>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <InputFieldError state={state} field="password" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <InputFieldError state={state} field="confirmPassword" />
                </Field>
              </>
            )}

            <SpecialtyMultiSelect
              selectedSpecialtyIds={specialtySelection.selectedSpecialtyIds}
              removedSpecialtyIds={specialtySelection.removedSpecialtyIds}
              currentSpecialtyId={specialtySelection.currentSpecialtyId}
              availableSpecialties={specialtySelection.getAvailableSpecialties(
                specialties!,
              )}
              isEdit={isEdit}
              onCurrentSpecialtyChange={
                specialtySelection.setCurrentSpecialtyId
              }
              onAddSpecialty={specialtySelection.handleAddSpecialty}
              onRemoveSpecialty={specialtySelection.handleRemoveSpecialty}
              getSpecialtyTitle={getSpecialtyTitle}
              getNewSpecialties={specialtySelection.getNewSpecialties}
            />
            <InputFieldError field="specialties" state={state} />

            <Field>
              <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
              <Input
                id="contactNumber"
                name="contactNumber"
                placeholder="+1234567890"
                defaultValue={doctor?.contactNumber}
              />
              <InputFieldError state={state} field="contactNumber" />
            </Field>

            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City, Country"
                defaultValue={isEdit ? doctor?.address : undefined}
              />
              <InputFieldError state={state} field="address" />
            </Field>

            <Field>
              <FieldLabel htmlFor="registrationNumber">
                Registration Number
              </FieldLabel>
              <Input
                id="registrationNumber"
                name="registrationNumber"
                placeholder="REG123456"
                defaultValue={isEdit ? doctor?.registrationNumber : undefined}
              />
              <InputFieldError state={state} field="registrationNumber" />
            </Field>

            <Field>
              <FieldLabel htmlFor="experience">
                Experience (in years)
              </FieldLabel>
              <Input
                id="experience"
                name="experience"
                type="number"
                placeholder="5"
                defaultValue={isEdit ? doctor?.experience : undefined}
                min="0"
              />
              <InputFieldError state={state} field="experience" />
            </Field>

            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <Input
                id="gender"
                name="gender"
                placeholder="Select gender"
                value={gender}
                readOnly
                type="hidden"
              />
              <Select
                value={gender}
                onValueChange={(value) => setGender(value as "MALE" | "FEMALE")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError state={state} field="gender" />
            </Field>

            <Field>
              <FieldLabel htmlFor="appointmentFee">Appointment Fee</FieldLabel>
              <Input
                id="appointmentFee"
                name="appointmentFee"
                type="number"
                placeholder="100"
                defaultValue={isEdit ? doctor?.appointmentFee : undefined}
                min="0"
              />
              <InputFieldError state={state} field="appointmentFee" />
            </Field>

            <Field>
              <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
              <DoctorQualificationSelect
                id="qualification"
                name="qualification"
                defaultValue={isEdit ? doctor?.qualification : ""}
                disabled={pending}
                placeholder="Select or type qualifications (e.g. MBBS, MD)..."
              />
              <InputFieldError state={state} field="qualification" />
            </Field>

            <Field>
              <FieldLabel htmlFor="currentWorkingPlace">
                Current Working Place
              </FieldLabel>
              <Input
                id="currentWorkingPlace"
                name="currentWorkingPlace"
                placeholder="City Hospital"
                defaultValue={isEdit ? doctor?.currentWorkingPlace : undefined}
              />
              <InputFieldError state={state} field="currentWorkingPlace" />
            </Field>

            <Field>
              <FieldLabel htmlFor="designation">Designation</FieldLabel>
              <Input
                id="designation"
                name="designation"
                placeholder="Senior Consultant"
                defaultValue={isEdit ? doctor?.designation : undefined}
              />
              <InputFieldError state={state} field="designation" />
            </Field>

            {!isEdit && (
              <Field>
                <FieldLabel htmlFor="file">Profile Photo</FieldLabel>
                <Input id="file" name="file" type="file" accept="image/*" />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a profile photo for the doctor
                </p>
                <InputFieldError state={state} field="file" />
              </Field>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t bg-muted/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : isEdit
                  ? "Update Doctor"
                  : "Create Doctor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorFormDialog;
