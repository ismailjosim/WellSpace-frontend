"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth/loginUser";
import { submitMfaChallenge } from "@/services/auth/mfa.service";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import InputFieldError from "../../shared/InputFieldError";

export function LoginForm({ redirect }: { redirect?: string }) {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [isBackupCode, setIsBackupCode] = useState(false);
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);
  const [isMfaCancelled, setIsMfaCancelled] = useState(false);
  const router = useRouter();

  const mfaActiveToken =
    !isMfaCancelled && state?.mfaRequired ? (state.mfaToken as string) : null;

  // ✅ handle toast + redirect logic
  useEffect(() => {
    if (!state) return;

    if (state.mfaRequired && state.mfaToken) {
      toast.info("Two-Factor Authentication required. Please enter your code.");
      return;
    }

    if (state.success) {
      if (state.redirectTo) {
        router.push(state.redirectTo);
      }
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaActiveToken || !mfaCode.trim()) {
      toast.error("Please enter your verification code");
      return;
    }

    try {
      setIsVerifyingMfa(true);
      const res = await submitMfaChallenge(
        mfaActiveToken,
        mfaCode.trim(),
        isBackupCode,
        redirect || null,
      );

      if (res.success && res.redirectTo) {
        toast.success(res.message);
        router.push(res.redirectTo);
      } else {
        toast.error(res.message || "Failed to verify code");
      }
    } catch {
      toast.error("An error occurred during verification");
    } finally {
      setIsVerifyingMfa(false);
    }
  };

  // 🛡️ 2FA Challenge View
  if (mfaActiveToken) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Two-Factor Authentication</h3>
          <p className="text-xs text-muted-foreground">
            {isBackupCode
              ? "Enter one of your emergency 8-character backup recovery codes."
              : "Enter the 6-digit verification code from your authenticator app (Google Authenticator, Authy)."}
          </p>
        </div>

        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="mfaCode">
              {isBackupCode ? "Recovery Backup Code" : "6-Digit Security PIN"}
            </FieldLabel>
            <div className="relative">
              <Input
                id="mfaCode"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder={isBackupCode ? "e.g. 4F8A9C12" : "123456"}
                maxLength={isBackupCode ? 16 : 6}
                className="text-center text-lg font-mono tracking-widest"
                autoFocus
                autoComplete="one-time-code"
              />
              <KeyRound className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </Field>

          <Button
            type="submit"
            className="w-full"
            disabled={isVerifyingMfa || !mfaCode}
          >
            {isVerifyingMfa ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify & Access Account"
            )}
          </Button>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => {
                setIsBackupCode(!isBackupCode);
                setMfaCode("");
              }}
              className="text-primary hover:underline font-medium"
            >
              {isBackupCode
                ? "Use Authenticator App (TOTP)"
                : "Use emergency backup code"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsMfaCancelled(true);
                setMfaCode("");
              }}
              className="flex items-center text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to login
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}

      <FieldGroup>
        {/* Email Field */}
        <Field>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
          />
          <InputFieldError field="email" state={state} />
        </Field>

        {/* Password Field */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <InputFieldError field="password" state={state} />
        </Field>

        {/* Submit Button */}
        <Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing In..." : "Sign In"}
            <LogIn className="w-4 h-4 ml-2" />
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <Separator className="flex-1" />
            <span className="text-sm font-medium text-muted-foreground">
              OR
            </span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" type="button" className="w-full">
            Login with Google
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}

export default LoginForm;
