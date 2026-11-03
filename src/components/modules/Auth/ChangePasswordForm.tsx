"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/services/auth/authService";
import { Check, Eye, EyeOff, Loader2, Lock, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isDialog?: boolean;
}

export const ChangePasswordForm = ({
  onSuccess,
  onCancel,
  isDialog = false,
}: ChangePasswordFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(changePassword, null);

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [newPasswordValue, setNewPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");

  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    if (state?.success && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.success(state.message || "Password changed successfully!");
      if (formRef.current) {
        formRef.current.reset();
      }
      setNewPasswordValue("");
      setConfirmPasswordValue("");
      onSuccess?.();
    } else if (state?.message && !state.success && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  const handleSubmit = (formData: FormData) => {
    hasNotifiedRef.current = false;
    formAction(formData);
  };

  const isMinLength = newPasswordValue.length >= 6;
  const isMatching =
    confirmPasswordValue.length > 0 &&
    newPasswordValue === confirmPasswordValue;

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Current / Old Password */}
      <Field>
        <FieldLabel htmlFor="oldPassword" required>
          Current Password
        </FieldLabel>
        <div className="relative">
          <Input
            id="oldPassword"
            name="oldPassword"
            type={showOldPass ? "text" : "password"}
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowOldPass(!showOldPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            tabIndex={-1}
            aria-label={showOldPass ? "Hide password" : "Show password"}
          >
            {showOldPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <InputFieldError field="oldPassword" state={state} />
      </Field>

      {/* New Password */}
      <Field>
        <FieldLabel htmlFor="newPassword" required>
          New Password
        </FieldLabel>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPass ? "text" : "password"}
            placeholder="Enter at least 6 characters"
            autoComplete="new-password"
            value={newPasswordValue}
            onChange={(e) => setNewPasswordValue(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPass(!showNewPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            tabIndex={-1}
            aria-label={showNewPass ? "Hide password" : "Show password"}
          >
            {showNewPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <InputFieldError field="newPassword" state={state} />
      </Field>

      {/* Confirm New Password */}
      <Field>
        <FieldLabel htmlFor="confirmPassword" required>
          Confirm New Password
        </FieldLabel>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPass ? "text" : "password"}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            value={confirmPasswordValue}
            onChange={(e) => setConfirmPasswordValue(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
            tabIndex={-1}
            aria-label={showConfirmPass ? "Hide password" : "Show password"}
          >
            {showConfirmPass ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <InputFieldError field="confirmPassword" state={state} />
      </Field>

      {/* Requirement Guidance checklist */}
      {newPasswordValue.length > 0 && (
        <div className="rounded-xl bg-accent/40 border border-border/50 p-3 text-xs space-y-1.5 transition-all">
          <div className="flex items-center gap-2">
            {isMinLength ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
            <span
              className={
                isMinLength
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              At least 6 characters long
            </span>
          </div>

          {confirmPasswordValue.length > 0 && (
            <div className="flex items-center gap-2">
              {isMatching ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 text-destructive shrink-0" />
              )}
              <span
                className={
                  isMatching
                    ? "text-foreground font-medium"
                    : "text-destructive font-medium"
                }
              >
                {isMatching ? "Passwords match" : "Passwords do not match"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className={isDialog ? "flex-1 sm:flex-none" : "w-full sm:w-auto"}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
