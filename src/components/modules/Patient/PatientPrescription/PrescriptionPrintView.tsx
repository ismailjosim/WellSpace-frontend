"use client";

import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface IPrescriptionDetail {
  id: string;
  instructions: string;
  followUpDate?: string | null;
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
    qualification?: string;
    designation?: string;
    currentWorkingPlace?: string;
    registrationNumber?: string;
  };
  patient?: {
    id: string;
    name: string;
    patientHealthData?: {
      bloodGroup?: string | null;
      hasAllergies?: boolean | null;
    } | null;
  };
  appointment?: {
    id: string;
  };
}

interface PrescriptionPrintViewProps {
  prescription: IPrescriptionDetail;
}

export default function PrescriptionPrintView({
  prescription,
}: PrescriptionPrintViewProps) {
  const doctor = prescription.doctor || { id: "", name: "" };
  const patient = prescription.patient || { id: "", name: "" };
  const healthData = patient.patientHealthData || {};

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between no-print bg-card p-4 rounded-xl border">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/my-prescriptions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Prescriptions
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Print Prescription
          </Button>
        </div>
      </div>

      {/* Printable Medical Prescription Card */}
      <div
        id="printable-prescription"
        className="bg-white text-slate-900 rounded-xl border p-8 shadow-sm print:border-none print:shadow-none print:p-0 max-w-4xl mx-auto"
      >
        {/* Prescription Header / Doctor Letterhead */}
        <div className="flex justify-between items-start border-b-2 border-primary/80 pb-6 mb-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-primary tracking-tight">
              Dr. {doctor.name || "Doctor"}
            </h2>
            <p className="text-sm font-medium text-slate-700">
              {doctor.qualification}
            </p>
            <p className="text-xs text-slate-600">
              {doctor.designation} — {doctor.currentWorkingPlace}
            </p>
            <p className="text-xs font-mono text-slate-500 mt-1">
              BMDC Reg. No: {doctor.registrationNumber || "N/A"}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-primary font-bold text-xl">
              <span className="text-primary font-black tracking-wider">
                WellSpace
              </span>
              <span className="text-xs uppercase bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                Telehealth
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Official Electronic Prescription
            </p>
            <p className="text-xs text-slate-500">support@wellspace.health</p>
            <p className="text-xs font-mono text-slate-400">
              Rx Ref: #{prescription.id?.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Patient Demographics Strip */}
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-8">
          <div>
            <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
              Patient Name
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {patient.name || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
              Date of Consult
            </span>
            <span className="font-medium text-slate-800">
              {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
              Blood Group
            </span>
            <span className="font-medium text-slate-800">
              {healthData.bloodGroup
                ? healthData.bloodGroup.replace("_", " ")
                : "Not Specified"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block uppercase tracking-wider text-[10px]">
              Allergies
            </span>
            <span className="font-medium text-slate-800">
              {healthData.hasAllergies
                ? "Yes (Known Allergies)"
                : "None Reported"}
            </span>
          </div>
        </div>

        {/* Clinical Prescription Content (Rx Body) */}
        <div className="min-h-[300px] space-y-6">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-3xl select-none">
            <span>℞</span>
          </div>

          <div className="space-y-4 pl-4 border-l-2 border-slate-200">
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-2">
                Advised Medications & Clinical Instructions:
              </h4>
              <div className="whitespace-pre-wrap font-sans text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-4 rounded-md border border-slate-100">
                {prescription.instructions}
              </div>
            </div>

            {prescription.followUpDate && (
              <div className="mt-6 p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                <span className="font-semibold">
                  Recommended Follow-up Date:
                </span>{" "}
                {new Date(prescription.followUpDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </div>
            )}
          </div>
        </div>

        {/* Signature & Seal Footer */}
        <div className="border-t border-slate-200 mt-12 pt-6 flex justify-between items-end text-xs text-slate-500">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-green-700 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Digitally Verified & Encrypted</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Generated by WellSpace Healthcare System. Valid for pharmacy
              dispensing.
            </p>
          </div>

          <div className="text-center space-y-1">
            <div className="w-44 border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-700">
              Dr. {doctor.name}
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
