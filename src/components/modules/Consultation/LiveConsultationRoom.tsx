"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCw,
  Stethoscope,
  User,
  Video,
  VideoOff,
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
  const [mediaError, setMediaError] = useState("");
  const [isRequestingMedia, setIsRequestingMedia] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [callDuration, setCallDuration] = useState(
    session?.durationSeconds || 0,
  );
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(session?.notes || "");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const requestMediaAccess = useCallback(async () => {
    setIsRequestingMedia(true);
    setMediaError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone access requires a supported browser and a secure connection (HTTPS).",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = stream;
      setHasPermissions(true);
      setMicActive(stream.getAudioTracks().length > 0);
      setVideoActive(stream.getVideoTracks().length > 0);
    } catch (error) {
      console.warn("Camera or microphone permission was not granted:", error);
      setHasPermissions(false);
      setMicActive(false);
      setVideoActive(false);

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMediaError(
          "Camera or microphone access was denied. Allow access in your browser's site settings, then try again.",
        );
      } else if (error instanceof DOMException && error.name === "NotFoundError") {
        setMediaError(
          "No camera or microphone was found. Connect a device or continue with chat.",
        );
      } else {
        setMediaError(
          error instanceof Error
            ? error.message
            : "Unable to access your camera or microphone.",
        );
      }
    } finally {
      setIsRequestingMedia(false);
    }
  }, []);

  useEffect(() => {
    const requestTimer = window.setTimeout(() => {
      void requestMediaAccess();
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [requestMediaAccess]);

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        hasPermissions && videoActive ? localStreamRef.current : null;
    }
  }, [hasPermissions, videoActive]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const nextState = !micActive;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = nextState;
    });
    setMicActive(nextState);
  };

  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    const nextState = !videoActive;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = nextState;
    });
    setVideoActive(nextState);
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const result = await saveConsultationNotes(appointment.id, doctorNotes);
      if (!result.success) {
        toast.error(result.message || "Unable to save consultation notes");
        return;
      }
      toast.success("Notes saved");
    } catch (error) {
      console.error("Error saving consultation notes:", error);
      toast.error("Unable to save consultation notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleEndCall = async () => {
    if (!confirm("Are you sure you want to end this consultation session?"))
      return;

    setIsEndingCall(true);
    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      const result = await endConsultationSession(appointment.id, doctorNotes);
      if (!result.success) {
        toast.error(result.message || "Unable to end consultation");
        setIsEndingCall(false);
        return;
      }
      toast.success("Consultation session ended");

      if (userRole === "DOCTOR") {
        router.push("/doctor/dashboard/appointments");
      } else {
        router.push("/dashboard/my-appointments");
      }
    } catch (error) {
      console.error("Error ending consultation:", error);
      toast.error("Unable to end consultation");
      setIsEndingCall(false);
    }
  };

  const counterpartName =
    userRole === "PATIENT"
      ? `Dr. ${appointment.doctor.name}`
      : appointment.patient.name;

  return (
    <div className="flex h-[calc(100dvh-8rem)] min-h-[560px] max-h-[1000px] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              hasPermissions ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight">
              {counterpartName}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {userRole === "PATIENT"
                ? appointment.doctor.designation || "Doctor consultation"
                : "Patient consultation"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>{formatTimer(callDuration)}</span>
        </div>

        <AppointmentChatDialog
          appointmentId={appointment.id}
          counterpartName={counterpartName}
          role={userRole}
        />
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden">
        <section
          aria-label="Consultation video"
          className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/50"
        >
          <div className="px-4 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              {userRole === "PATIENT" ? (
                <Stethoscope className="h-11 w-11" />
              ) : (
                <User className="h-11 w-11" />
              )}
            </div>
            <h2 className="mt-4 font-semibold">{counterpartName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Consultation in progress
            </p>
          </div>

          <div className="absolute bottom-4 right-4 h-28 w-36 overflow-hidden rounded-xl border border-border bg-card shadow-md sm:h-36 sm:w-52">
            {videoActive ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                aria-label="Your camera preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Camera is off
              </div>
            )}
            <span className="absolute bottom-2 left-2 rounded bg-foreground/80 px-2 py-0.5 text-[10px] font-medium text-background">
              You
            </span>
          </div>
        </section>

        {userRole === "DOCTOR" && (
          <aside className="flex min-h-[260px] flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:min-h-0">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
              <FileText className="h-4 w-4" />
              Consultation notes
            </h2>
            <textarea
              value={doctorNotes}
              onChange={(event) => setDoctorNotes(event.target.value)}
              placeholder="Record clinical impressions, dosage notes, or symptoms to include in medical records..."
              aria-label="Consultation notes"
              className="min-h-36 w-full flex-1 resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
            >
              {isSavingNotes ? "Saving..." : "Save notes"}
            </Button>
          </aside>
        )}
      </main>

      {hasPermissions === false && (
        <div
          role="alert"
          className="mx-3 mb-3 flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-3 sm:mx-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium">Camera or microphone unavailable</p>
              <p className="mt-0.5 text-muted-foreground">{mediaError}</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void requestMediaAccess()}
            disabled={isRequestingMedia}
            className="shrink-0"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRequestingMedia ? "animate-spin" : ""}`}
            />
            {isRequestingMedia ? "Requesting..." : "Allow access"}
          </Button>
        </div>
      )}

      {hasPermissions === null && (
        <div
          role="status"
          className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground sm:mx-4"
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Requesting camera and microphone access...
        </div>
      )}

      <footer className="flex items-center justify-center gap-3 border-t border-border bg-muted/30 px-4 py-4">
        <Button
          size="icon"
          variant={micActive ? "secondary" : "outline"}
          className={`h-12 w-12 rounded-full ${!micActive ? "text-muted-foreground" : ""}`}
          onClick={toggleMic}
          disabled={!hasPermissions}
          aria-label={micActive ? "Mute microphone" : "Unmute microphone"}
          title={micActive ? "Mute microphone" : "Unmute microphone"}
        >
          {micActive ? (
            <Mic className="h-5 w-5" />
          ) : (
            <MicOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant={videoActive ? "secondary" : "outline"}
          className={`h-12 w-12 rounded-full ${!videoActive ? "text-muted-foreground" : ""}`}
          onClick={toggleVideo}
          disabled={!hasPermissions}
          aria-label={videoActive ? "Turn camera off" : "Turn camera on"}
          title={videoActive ? "Turn camera off" : "Turn camera on"}
        >
          {videoActive ? (
            <Video className="h-5 w-5" />
          ) : (
            <VideoOff className="h-5 w-5" />
          )}
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className="h-12 w-12 rounded-full"
          onClick={handleEndCall}
          disabled={isEndingCall}
          aria-label="End consultation"
          title="End consultation"
        >
          <PhoneOff className="h-5 w-5" />
        </Button>
      </footer>
    </div>
  );
}
