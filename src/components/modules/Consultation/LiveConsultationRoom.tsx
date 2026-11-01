"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Clock,
  User,
  Stethoscope,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  endConsultationSession,
  saveConsultationNotes,
} from "@/services/consultation/consultation.service";
import AppointmentChatDialog from "../Chat/AppointmentChatDialog";

interface IConsultationData {
  appointment: {
    id: string;
    status: string;
    doctor: {
      id: string;
      name: string;
      designation?: string;
      qualification?: string;
      profilePhoto?: string;
    };
    patient: {
      id: string;
      name: string;
      contactNumber?: string;
      profilePhoto?: string;
    };
  };
  session: {
    id: string;
    durationSeconds?: number;
    notes?: string;
  };
}

interface LiveConsultationRoomProps {
  initialData: IConsultationData;
  userRole: "PATIENT" | "DOCTOR";
}

export default function LiveConsultationRoom({
  initialData,
  userRole,
}: LiveConsultationRoomProps) {
  const router = useRouter();
  const appointment = initialData.appointment;
  const session = initialData.session;

  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDuration, setCallDuration] = useState(
    session?.durationSeconds || 0,
  );
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(session?.notes || "");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize Local Media Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        activeStream = stream;
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setHasPermissions(true);
      } catch (err) {
        console.warn("Camera/Mic access error:", err);
        setHasPermissions(false);
        toast.error(
          "Camera or microphone access denied. You can still use chat.",
        );
      }
    }

    initMedia();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev: number) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !micActive;
      });
      setMicActive((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !videoActive;
      });
      setVideoActive((prev) => !prev);
    }
  };

  const handleEndCall = async () => {
    if (!confirm("Are you sure you want to end this consultation session?"))
      return;

    setIsEndingCall(true);
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      await endConsultationSession(appointment.id, doctorNotes);
      toast.success("Consultation session ended");

      if (userRole === "DOCTOR") {
        router.push("/doctor/dashboard/appointments");
      } else {
        router.push("/dashboard/my-appointments");
      }
    } catch {
      toast.error("Error ending consultation");
      setIsEndingCall(false);
    }
  };

  const counterpartName =
    userRole === "PATIENT"
      ? `Dr. ${appointment.doctor.name}`
      : appointment.patient.name;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
          <div>
            <h3 className="font-semibold text-sm tracking-tight">
              {counterpartName}
            </h3>
            <p className="text-[11px] text-slate-400">
              {userRole === "PATIENT"
                ? appointment.doctor.designation
                : "Patient Consultation"}
            </p>
          </div>
        </div>

        {/* Live Call Duration */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-mono font-medium text-slate-300">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{formatTimer(callDuration)}</span>
        </div>

        {/* Top Right Action: Chat */}
        <div>
          <AppointmentChatDialog
            appointmentId={appointment.id}
            counterpartName={counterpartName}
            role={userRole}
          />
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 relative flex items-center justify-center p-4 bg-linear-to-b from-slate-950 to-slate-900">
        {/* Remote Video Placeholder (Counterpart Feed) */}
        <div className="w-full h-full rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-center space-y-3">
            <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-primary/50 flex items-center justify-center mx-auto text-primary">
              {userRole === "PATIENT" ? (
                <Stethoscope className="h-12 w-12" />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>
            <div>
              <p className="font-semibold text-base">{counterpartName}</p>
              <p className="text-xs text-slate-400">
                Connected & Consult in progress
              </p>
            </div>
          </div>

          {/* Local User Picture-in-Picture Self Feed */}
          <div className="absolute bottom-4 right-4 w-44 h-32 sm:w-56 sm:h-40 rounded-xl bg-slate-800 border border-slate-700 shadow-xl overflow-hidden">
            {hasPermissions ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${videoActive ? "block" : "hidden"}`}
              />
            ) : null}

            {!videoActive && (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs font-medium">
                Camera Off
              </div>
            )}
            <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white font-medium">
              You
            </div>
          </div>
        </div>

        {/* Doctor Clinical Workspace (Right Sidebar for Doctor only) */}
        {userRole === "DOCTOR" && (
          <div className="hidden lg:flex flex-col w-80 h-full ml-4 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FileText className="h-4 w-4" />
              <span>Consultation Notes</span>
            </div>
            <textarea
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Record clinical impressions, dosage notes, or symptoms to include in medical records..."
              className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 resize-none focus:outline-hidden focus:border-primary"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                saveConsultationNotes(appointment.id, doctorNotes);
                toast.success("Notes saved");
              }}
            >
              Save Notes
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Floating Controls Toolbar */}
      <div className="flex items-center justify-center gap-4 py-4 bg-slate-900/90 backdrop-blur border-t border-slate-800">
        {/* Toggle Audio */}
        <Button
          size="icon"
          variant={micActive ? "secondary" : "destructive"}
          className="h-12 w-12 rounded-full"
          onClick={toggleMic}
        >
          {micActive ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>

        {/* Toggle Video */}
        <Button
          size="icon"
          variant={videoActive ? "secondary" : "destructive"}
          className="h-12 w-12 rounded-full"
          onClick={toggleVideo}
        >
          {videoActive ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>

        {/* End Call Button */}
        <Button
          size="icon"
          variant="destructive"
          className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700"
          onClick={handleEndCall}
          disabled={isEndingCall}
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
