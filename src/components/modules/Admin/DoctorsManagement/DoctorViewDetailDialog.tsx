import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { IDoctor } from "@/types/doctor.interface";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  User,
  ShieldCheck,
  FileText,
  ExternalLink,
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { formatDateTime, getInitials } from "@/lib/formatters.ts";
import InfoRow from "@/components/shared/InoRow";
import { updateDoctorVerificationStatus } from "@/services/admin/doctorsManagement";
import { toast } from "sonner";

interface IDoctorWithVerification extends IDoctor {
  verificationStatus?: string;
  licenseDocumentUrl?: string | null;
  degreeDocumentUrl?: string | null;
}

interface IDoctorViewDialogProps {
  open: boolean;
  onClose: () => void;
  doctor: IDoctorWithVerification | null;
}

const DoctorViewDetailDialog = ({
  open,
  onClose,
  doctor,
}: IDoctorViewDialogProps) => {
  const router = useRouter();
  const [status, setStatus] = useState<string>(
    doctor?.verificationStatus || "PENDING",
  );
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!doctor) {
    return null;
  }

  const handleApprove = async () => {
    if (!doctor?.id) return;
    try {
      setIsProcessing(true);
      const res = await updateDoctorVerificationStatus(doctor.id, {
        status: "VERIFIED",
      });
      if (res.success) {
        setStatus("VERIFIED");
        toast.success(`Dr. ${doctor.name} has been verified successfully!`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to approve doctor");
      }
    } catch {
      toast.error("Failed to approve doctor verification");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!doctor?.id || !rejectionReasonInput.trim()) return;
    try {
      setIsProcessing(true);
      const res = await updateDoctorVerificationStatus(doctor.id, {
        status: "REJECTED",
        rejectionReason: rejectionReasonInput.trim(),
      });
      if (res.success) {
        setStatus("REJECTED");
        setShowRejectInput(false);
        toast.success(`Verification for Dr. ${doctor.name} has been rejected.`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to reject doctor");
      }
    } catch {
      toast.error("Failed to reject doctor verification");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Doctor Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={doctor?.profilePhoto} alt={doctor?.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(doctor?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-1">{doctor?.name}</h2>
              <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {doctor?.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant={doctor?.isDeleted ? "destructive" : "default"}
                  className="text-sm"
                >
                  {doctor?.isDeleted ? "Inactive" : "Active"}
                </Badge>
                {doctor?.averageRating !== undefined && doctor?.averageRating !== null && (
                  <Badge
                    variant="default"
                    className="text-sm bg-accent-foreground"
                  >
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {Number(doctor.averageRating ?? 0).toFixed(1)} Rating
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Professional Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  Professional Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Designation"
                    value={doctor?.designation || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Qualification"
                    value={doctor?.qualification || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Registration Number"
                    value={doctor?.registrationNumber || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Experience"
                    value={
                      doctor?.experience
                        ? `${doctor.experience} years`
                        : "Not specified"
                    }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Current Working Place"
                    value={doctor?.currentWorkingPlace || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Appointment Fee"
                    value={
                      doctor?.appointmentFee
                        ? `$${doctor.appointmentFee}`
                        : "Not specified"
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Specialties */}
            {doctor?.doctorSpecialties &&
              doctor.doctorSpecialties.length > 0 && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-lg">Specialties</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doctor.doctorSpecialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-4 py-2 text-sm"
                        >
                          {specialty.specialties?.title || "Unknown"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Contact Number"
                    value={doctor?.contactNumber || "Not provided"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Email"
                    value={doctor?.email || "Not provided"}
                  />
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Address"
                    value={doctor?.address || "Not provided"}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Personal Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Gender"
                    value={
                      doctor?.gender
                        ? doctor.gender.charAt(0) +
                          doctor.gender.slice(1).toLowerCase()
                        : "Not specified"
                    }
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(doctor?.createdAt || "")}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(doctor?.updatedAt || "")}
                  />
                </div>
                {doctor?.averageRating !== undefined && (
                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 mt-1 text-muted-foreground" />
                    <InfoRow
                      label="Average Rating"
                      value={`${doctor.averageRating.toFixed(1)} / 5.0`}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Credential Verification & Compliance Review Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-lg">
                    Medical Credential Verification & Compliance
                  </h3>
                </div>
                <Badge
                  variant={
                    status === "VERIFIED"
                      ? "default"
                      : status === "REJECTED"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {status}
                </Badge>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        BMDC / Medical Council Registration
                      </span>
                      <span className="text-sm font-semibold">
                        {doctor?.registrationNumber}
                      </span>
                      {doctor?.licenseDocumentUrl ? (
                        <a
                          href={doctor.licenseDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          <ExternalLink className="h-3 w-3" /> View Uploaded
                          License Certificate
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          No document certificate uploaded
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground block font-medium">
                        Graduation Degree Proof
                      </span>
                      <span className="text-sm font-semibold">
                        {doctor?.qualification}
                      </span>
                      {doctor?.degreeDocumentUrl ? (
                        <a
                          href={doctor.degreeDocumentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                        >
                          <ExternalLink className="h-3 w-3" /> View Uploaded
                          Degree Certificate
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground block mt-0.5">
                          No degree certificate uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Decision Controls */}
                <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    Review official registration databases before granting
                    clinical prescription authority.
                  </span>

                  <div className="flex items-center gap-2">
                    {status !== "VERIFIED" && (
                      <Button
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleApprove}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Approve & Verify
                      </Button>
                    )}

                    {status !== "REJECTED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isProcessing}
                        onClick={() => setShowRejectInput(!showRejectInput)}
                        className="text-xs flex items-center gap-1.5"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject...
                      </Button>
                    )}
                  </div>
                </div>

                {showRejectInput && (
                  <div className="pt-2 space-y-2">
                    <Input
                      placeholder="Specify reason for credential rejection (e.g. invalid BMDC number, blurry image)..."
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowRejectInput(false)}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isProcessing || !rejectionReasonInput.trim()}
                        onClick={handleReject}
                        className="text-xs"
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorViewDetailDialog;
