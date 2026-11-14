import ForgotPasswordForm from "@/components/modules/Auth/ForgotPasswordForm";
import { KeyRound } from "lucide-react";

export const metadata = {
  title: "Forgot Password | WellSpace",
  description: "Recover access to your WellSpace healthcare account",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-3xl border bg-card p-8 shadow-xl">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter the email associated with your WellSpace account and we will
            send you a secure link to reset your credentials.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  );
}
