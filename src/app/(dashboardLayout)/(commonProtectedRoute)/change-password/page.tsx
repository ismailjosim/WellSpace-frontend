import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChangePasswordForm from "@/components/modules/Auth/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | WellSpace",
  description: "Update your account password securely.",
};

const ChangePasswordPage = () => {
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Back link */}
      <Link
        href="/my-profile"
        className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2 border-b border-border/50 pb-6">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">
                Change Password
              </CardTitle>
              <CardDescription className="text-xs">
                Ensure your WellSpace account remains secure by using a strong,
                unique password.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ChangePasswordForm />

          <div className="mt-8 border-t border-border/50 pt-6">
            <div className="flex items-start gap-3 rounded-xl bg-muted/40 p-3.5 border border-border/40 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-foreground">
                  Security Recommendation
                </span>
                <p>
                  Avoid reusing passwords across multiple platforms. If you have
                  two-factor authentication (2FA) active, it will continue to
                  protect your session seamlessly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
