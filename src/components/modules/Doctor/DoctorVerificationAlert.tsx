"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  XCircle,
  Upload,
  Loader2,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { uploadDoctorVerificationDocuments } from "@/services/admin/doctorsManagement";

interface DoctorVerificationAlertProps {
  status?: "PENDING" | "UNDER_REVIEW" | "VERIFIED" | "REJECTED";
  rejectionReason?: string | null;
  licenseDocumentUrl?: string | null;
  degreeDocumentUrl?: string | null;
}

export default function DoctorVerificationAlert({
  status = "PENDING",
  rejectionReason,
  licenseDocumentUrl,
  degreeDocumentUrl,
}: DoctorVerificationAlertProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (currentStatus === "VERIFIED") {
    return (
      <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-medium">
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          <strong>Credentials Verified:</strong> You are fully authorized to
          accept bookings and issue clinical prescriptions.
        </span>
      </div>
    );
  }

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const licenseFile = formData.get("licenseDocument") as File | null;
    const degreeFile = formData.get("degreeDocument") as File | null;

    if (!licenseFile?.name && !degreeFile?.name) {
      toast.error("Please select at least one document to upload");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDoctorVerificationDocuments(formData);
      if (res.success) {
        setCurrentStatus("UNDER_REVIEW");
        setModalOpen(false);
        toast.success(
          "Medical certificates submitted successfully! Status updated to Under Review.",
        );
      } else {
        toast.error(res.message || "Failed to submit verification documents");
      }
    } catch {
      toast.error("An error occurred during document upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {currentStatus === "PENDING" && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm">
                Medical Credential Verification Required
              </h4>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                Upload your Medical Council Registration and MBBS/MD
                certificates. You cannot open appointment schedules until
                approved.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 text-xs"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Documents
          </Button>
        </div>
      )}

      {currentStatus === "UNDER_REVIEW" && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 rounded-xl text-xs">
          <Clock className="h-5 w-5 text-blue-600 shrink-0" />
          <div>
            <span className="font-semibold text-sm">
              Verification Under Review:{" "}
            </span>
            <span>
              Your credentials are being validated by compliance administrators.
              Reviews usually complete within 24-48 business hours.
            </span>
          </div>
        </div>
      )}

      {currentStatus === "REJECTED" && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm">
                Credential Verification Rejected
              </h4>
              <p className="text-xs">
                {rejectionReason ||
                  "Uploaded documents could not be verified by medical compliance."}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setModalOpen(true)}
            className="shrink-0 text-xs"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Re-Submit Credentials
          </Button>
        </div>
      )}

      {/* Document Upload Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Upload Medical Certificates
            </DialogTitle>
            <DialogDescription className="text-xs">
              Accepted formats: PDF, JPG, PNG (Max 5MB each). These files are
              reviewed strictly by authorized compliance staff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="licenseDocument"
                className="text-xs font-semibold"
              >
                Medical Council Registration Certificate (BMDC / Board)
              </Label>
              <Input
                id="licenseDocument"
                name="licenseDocument"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="text-xs cursor-pointer"
              />
              {licenseDocumentUrl && (
                <p className="text-[10px] text-muted-foreground truncate">
                  Current file: {licenseDocumentUrl}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="degreeDocument" className="text-xs font-semibold">
                Graduation Degree Certificate (MBBS, MD, FCPS)
              </Label>
              <Input
                id="degreeDocument"
                name="degreeDocument"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="text-xs cursor-pointer"
              />
              {degreeDocumentUrl && (
                <p className="text-[10px] text-muted-foreground truncate">
                  Current file: {degreeDocumentUrl}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading &
                  Submitting...
                </>
              ) : (
                "Submit Credentials for Review"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
