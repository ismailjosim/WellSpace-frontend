"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  initiateMfaSetup,
  verifyMfaSetup,
  disableMfa,
  IMfaSetupResponse,
} from "@/services/auth/mfa.service";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface MfaSettingsCardProps {
  isMfaInitiallyEnabled?: boolean;
}

export default function MfaSettingsCard({
  isMfaInitiallyEnabled = false,
}: MfaSettingsCardProps) {
  const [isMfaEnabled, setIsMfaEnabled] = useState(isMfaInitiallyEnabled);
  const [prevInitial, setPrevInitial] = useState(isMfaInitiallyEnabled);

  if (isMfaInitiallyEnabled !== prevInitial) {
    setPrevInitial(isMfaInitiallyEnabled);
    setIsMfaEnabled(isMfaInitiallyEnabled);
  }
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [setupData, setSetupData] = useState<IMfaSetupResponse["data"] | null>(
    null,
  );
  const [verificationCode, setVerificationCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  const handleStartSetup = async () => {
    try {
      setIsLoading(true);
      const res = await initiateMfaSetup();
      if (res.success && res.data) {
        setSetupData(res.data);
        setSetupModalOpen(true);
      } else {
        toast.error(res.message || "Failed to initiate MFA setup");
      }
    } catch {
      toast.error("Failed to start 2FA configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      const res = await verifyMfaSetup(verificationCode);
      if (res.success) {
        setIsMfaEnabled(true);
        setSetupModalOpen(false);
        setSetupData(null);
        setVerificationCode("");
        toast.success("Two-Factor Authentication is now active!");
      } else {
        toast.error(res.message || "Invalid verification code");
      }
    } catch {
      toast.error("Failed to verify 2FA code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!disableCode || disableCode.length !== 6) {
      toast.error("Please enter your current 6-digit verification code");
      return;
    }

    try {
      setIsLoading(true);
      const res = await disableMfa(disableCode);
      if (res.success) {
        setIsMfaEnabled(false);
        setDisableModalOpen(false);
        setDisableCode("");
        toast.success("Two-Factor Authentication has been disabled");
      } else {
        toast.error(res.message || "Failed to disable 2FA");
      }
    } catch {
      toast.error("An error occurred while disabling 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBackupCodes = () => {
    if (!setupData?.backupCodes) return;
    navigator.clipboard.writeText(setupData.backupCodes.join("\n"));
    setCopiedCodes(true);
    toast.success("Recovery backup codes copied to clipboard");
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">
                Two-Factor Authentication (2FA)
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Enhance clinical record and session security with Time-based
              One-Time Passwords (TOTP).
            </CardDescription>
          </div>
          <Badge
            variant={isMfaEnabled ? "default" : "secondary"}
            className="gap-1 text-xs"
          >
            {isMfaEnabled ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Active
              </>
            ) : (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Inactive
              </>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isMfaEnabled
              ? "Your account requires a 6-digit one-time passcode generated by Google Authenticator, 1Password, or Authy on each login."
              : "Require an authenticator app code whenever you sign in. This protects patient electronic health records (ePHI) from credential theft."}
          </p>

          <div className="flex items-center gap-3">
            {isMfaEnabled ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDisableModalOpen(true)}
                className="text-xs"
              >
                Disable 2FA
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleStartSetup}
                disabled={isLoading}
                className="text-xs flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Key className="h-3.5 w-3.5" />
                )}
                Set Up Two-Factor Authentication
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Setup Modal */}
      <Dialog open={setupModalOpen} onOpenChange={setSetupModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Enable Two-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-xs">
              Scan the QR code with your authenticator app (Google
              Authenticator, Authy, Microsoft Authenticator).
            </DialogDescription>
          </DialogHeader>

          {setupData && (
            <div className="space-y-5 pt-2">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-4 bg-muted/40 rounded-xl border">
                <Image
                  src={setupData.qrCode}
                  alt="2FA QR Code"
                  width={180}
                  height={180}
                  className="rounded-lg shadow-sm"
                  unoptimized
                />
                <span className="text-[11px] text-muted-foreground mt-2">
                  Secret Key:{" "}
                  <code className="font-mono font-bold text-foreground">
                    {setupData.secretKey}
                  </code>
                </span>
              </div>

              {/* Recovery Backup Codes */}
              <div className="space-y-2 bg-muted/50 p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    Emergency Backup Codes
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyBackupCodes}
                    className="h-7 text-[11px] gap-1"
                  >
                    {copiedCodes ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedCodes ? "Copied" : "Copy Codes"}
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Save these 8 one-time emergency codes in a safe place. You can
                  use them if you lose access to your authenticator.
                </p>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs bg-background p-2 rounded border">
                  {setupData.backupCodes.map((code, idx) => (
                    <span key={idx} className="text-center font-medium">
                      {code}
                    </span>
                  ))}
                </div>
              </div>

              {/* 6-digit confirmation */}
              <div className="space-y-2">
                <label className="text-xs font-medium">
                  Enter 6-Digit App Code to Confirm:
                </label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg font-mono tracking-widest"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleVerifySetup}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  "Verify & Enable 2FA"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Disable Modal */}
      <Dialog open={disableModalOpen} onOpenChange={setDisableModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Disable 2FA</DialogTitle>
            <DialogDescription className="text-xs">
              Enter your current 6-digit authenticator code to confirm disabling
              two-factor authentication.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="text-center text-lg font-mono tracking-widest"
              autoFocus
            />

            <Button
              variant="destructive"
              onClick={handleDisableMfa}
              disabled={isLoading || disableCode.length !== 6}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Confirm & Disable"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
