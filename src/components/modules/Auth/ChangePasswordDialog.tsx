"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import ChangePasswordForm from "./ChangePasswordForm";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <KeyRound className="h-4 w-4" />
            Security & Authentication
          </div>
          <DialogTitle className="text-xl">Change Password</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Enter your current password and choose a strong new password to keep
            your account protected.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <ChangePasswordForm
            isDialog={true}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
