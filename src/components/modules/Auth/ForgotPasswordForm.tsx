/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect } from "react";
import { forgotPassword } from "@/services/auth/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import { toast } from "sonner";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || "Password reset link sent to your email!");
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (state?.success) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            Check Your Inbox
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We have sent password recovery instructions to your email address.
            Please follow the link in the message to reset your password.
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Field>
        <FieldLabel htmlFor="email" required>
          Account Email
        </FieldLabel>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            defaultValue={state?.formData?.email || ""}
            autoComplete="email"
            required
            className="pr-10"
          />
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
        <InputFieldError field="email" state={state as any} />
      </Field>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-semibold"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending Link...
          </span>
        ) : (
          "Send Password Reset Link"
        )}
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
