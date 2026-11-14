"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Expand,
  FileText,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PhoneOff,
  RefreshCw,
  ScreenShare,
  ScreenShareOff,
  Stethoscope,
  User,
  Video,
  VideoOff,
  Wifi,
  WifiOff,
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

type ConnectionStatus =
  | "waiting"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
};

export default function LiveConsultationRoom({
  initialData,
  userRole,
}: LiveConsultationRoomProps) {
  const router = useRouter();
  const appointment = initialData.appointment;
  const session = initialData.session;

  // Permissions & local media states
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [mediaError, setMediaError] = useState("");
  const [isRequestingMedia, setIsRequestingMedia] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPipMinimized, setIsPipMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // WebRTC connection state
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("waiting");
  const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);

  // Call & notes state
  const [callDuration, setCallDuration] = useState(
    session?.durationSeconds || 0,
  );
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState(session?.notes || "");

  // Media refs
  const roomContainerRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const isMakingOfferRef = useRef(false);
  const lastSignalTimestampRef = useRef<number>(0);

  const counterpartName =
    userRole === "PATIENT"
      ? `Dr. ${appointment.doctor.name}`
      : appointment.patient.name;

  // Format call timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Relay WebRTC signals to backend
  const relaySignal = useCallback(
    async (type: string, payload: unknown) => {
      try {
        await fetch(`/api/consultation/${appointment.id}/signal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, payload }),
        });
      } catch (err) {
        console.error("Failed to relay signal:", err);
      }
    },
    [appointment.id],
  );

  // Process incoming WebRTC signal
  const handleIncomingSignal = useCallback(
    async (signal: { type: string; payload: unknown; timestamp: number }) => {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      try {
        if (signal.type === "offer") {
          const isPolite = userRole === "PATIENT";
          const offerCollision =
            isMakingOfferRef.current || pc.signalingState !== "stable";

          if (offerCollision && !isPolite) {
            return;
          }

          setConnectionStatus("connecting");
          await pc.setRemoteDescription(
            new RTCSessionDescription(
              signal.payload as RTCSessionDescriptionInit,
            ),
          );

          // Add local tracks if not already added
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
              const alreadyAdded = pc
                .getSenders()
                .some((s) => s.track === track);
              if (!alreadyAdded && localStreamRef.current) {
                pc.addTrack(track, localStreamRef.current);
              }
            });
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await relaySignal("answer", answer);
        } else if (signal.type === "answer") {
          if (pc.signalingState === "have-local-offer") {
            await pc.setRemoteDescription(
              new RTCSessionDescription(
                signal.payload as RTCSessionDescriptionInit,
              ),
            );
            setConnectionStatus("connected");
          }
        } else if (signal.type === "candidate" && signal.payload) {
          try {
            await pc.addIceCandidate(
              new RTCIceCandidate(signal.payload as RTCIceCandidateInit),
            );
          } catch (e) {
            console.warn("Error adding ICE candidate:", e);
          }
        }
      } catch (err) {
        console.error("Error handling WebRTC signal:", err);
      }
    },
    [userRole, relaySignal],
  );

  // Create and configure RTCPeerConnection
  const initPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;

    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerConnectionRef.current = pc;

    // Remote tracks listener
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        remoteStreamRef.current = stream;
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream;
        }
        setIsRemoteVideoActive(stream.getVideoTracks().length > 0);

        stream.onremovetrack = () => {
          setIsRemoteVideoActive(stream.getVideoTracks().length > 0);
        };
        stream.onaddtrack = () => {
          setIsRemoteVideoActive(stream.getVideoTracks().length > 0);
        };
        setConnectionStatus("connected");
      }
    };

    // ICE candidate forwarding
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        void relaySignal("candidate", event.candidate.toJSON());
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case "connected":
          setConnectionStatus("connected");
          break;
        case "connecting":
          setConnectionStatus("connecting");
          break;
        case "disconnected":
          setConnectionStatus("reconnecting");
          break;
        case "failed":
          setConnectionStatus("disconnected");
          break;
        case "closed":
          setConnectionStatus("waiting");
          break;
      }
    };

    // Doctor initiates the call offer
    pc.onnegotiationneeded = async () => {
      try {
        if (userRole === "DOCTOR") {
          isMakingOfferRef.current = true;
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await relaySignal("offer", offer);
        }
      } catch (err) {
        console.error("Error during negotiation:", err);
      } finally {
        isMakingOfferRef.current = false;
      }
    };

    return pc;
  }, [userRole, relaySignal]);

  // Request camera and microphone access
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
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = stream;

      setHasPermissions(true);
      setMicActive(stream.getAudioTracks().length > 0);
      setVideoActive(stream.getVideoTracks().length > 0);

      // Update local video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to PeerConnection
      const pc = initPeerConnection();
      stream.getTracks().forEach((track) => {
        const sender = pc
          .getSenders()
          .find((s) => s.track?.kind === track.kind);
        if (sender) {
          void sender.replaceTrack(track);
        } else {
          pc.addTrack(track, stream);
        }
      });
    } catch (error) {
      console.warn("Camera or microphone permission was not granted:", error);
      setHasPermissions(false);
      setMicActive(false);
      setVideoActive(false);

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMediaError(
          "Camera or microphone access was denied. Allow access in your browser's site settings, then click 'Allow access'.",
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
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
  }, [initPeerConnection]);

  // Setup media on mount
  useEffect(() => {
    const requestTimer = window.setTimeout(() => {
      void requestMediaAccess();
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [requestMediaAccess]);

  // Setup SSE & Polling WebRTC signal listener
  useEffect(() => {
    let isMounted = true;
    lastSignalTimestampRef.current = Date.now() - 30000;

    // 1. SSE Real-time signal receiver
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/notifications/stream");
      eventSource.addEventListener("webrtc_signal", (e: MessageEvent) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(e.data);
          if (data.appointmentId === appointment.id && data.signal) {
            lastSignalTimestampRef.current = Math.max(
              lastSignalTimestampRef.current,
              data.signal.timestamp,
            );
            void handleIncomingSignal(data.signal);
          }
        } catch (err) {
          console.error("Error parsing SSE webrtc_signal:", err);
        }
      });
    } catch {
      // EventSource not supported or unavailable, fallback poller will handle
    }

    // 2. High-reliability Polling Fallback (runs every 2.5s until connected, then every 12s)
    const pollSignals = async () => {
      if (!isMounted) return;
      try {
        const since = lastSignalTimestampRef.current;
        const res = await fetch(
          `/api/consultation/${appointment.id}/signals?since=${since}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          for (const signal of json.data) {
            lastSignalTimestampRef.current = Math.max(
              lastSignalTimestampRef.current,
              signal.timestamp,
            );
            await handleIncomingSignal(signal);
          }
        }
      } catch {
        // Ignore transient network errors
      }
    };

    const pollIntervalTime = connectionStatus === "connected" ? 12000 : 2500;
    const pollTimer = setInterval(pollSignals, pollIntervalTime);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [appointment.id, connectionStatus, handleIncomingSignal]);

  // Update local video element when permission / camera active changes
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject =
        hasPermissions && videoActive ? localStreamRef.current : null;
    }
  }, [hasPermissions, videoActive]);

  // Keep remote video attached
  useEffect(() => {
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [connectionStatus]);

  // Call duration ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Media Controls: Mic Toggle
  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const nextState = !micActive;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = nextState;
    });
    setMicActive(nextState);
  };

  // Media Controls: Camera Toggle
  const toggleVideo = () => {
    if (!localStreamRef.current) return;
    const nextState = !videoActive;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = nextState;
    });
    setVideoActive(nextState);
  };

  // Screen Sharing Toggle
  const toggleScreenShare = async () => {
    const pc = peerConnectionRef.current;

    if (isScreenSharing) {
      // Stop screen sharing and restore camera
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);

      if (localStreamRef.current && pc) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender && videoTrack) {
          void sender.replaceTrack(videoTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
      }
      toast.info("Screen sharing stopped");
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          toast.error("Screen sharing is not supported on this device/browser");
          return;
        }

        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        const screenTrack = screenStream.getVideoTracks()[0];

        // Automatically restore camera when screen sharing ends natively
        screenTrack.onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          if (localStreamRef.current && pc) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            const sender = pc
              .getSenders()
              .find((s) => s.track?.kind === "video");
            if (sender && videoTrack) {
              void sender.replaceTrack(videoTrack);
            }
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }
          }
          toast.info("Screen sharing stopped");
        };

        if (pc) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            void sender.replaceTrack(screenTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        toast.success("Sharing your screen");
      } catch (err) {
        console.warn("Screen share canceled or denied:", err);
      }
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!roomContainerRef.current) return;
    if (!document.fullscreenElement) {
      roomContainerRef.current.requestFullscreen().catch(() => null);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => null);
      setIsFullscreen(false);
    }
  };

  // Save doctor consultation notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const result = await saveConsultationNotes(appointment.id, doctorNotes);
      if (!result.success) {
        toast.error(result.message || "Unable to save consultation notes");
        return;
      }
      toast.success("Clinical notes saved");
    } catch (error) {
      console.error("Error saving consultation notes:", error);
      toast.error("Unable to save consultation notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  // End call
  const handleEndCall = async () => {
    if (!confirm("Are you sure you want to end this consultation session?"))
      return;

    setIsEndingCall(true);
    try {
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

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

  // Render connection badge
  const renderStatusBadge = () => {
    switch (connectionStatus) {
      case "connected":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live HD Video</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Connecting...</span>
          </div>
        );
      case "reconnecting":
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
            <WifiOff className="h-3 w-3 animate-pulse" />
            <span>Reconnecting...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Waiting for {counterpartName}</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={roomContainerRef}
      className="flex h-[calc(100dvh-8rem)] min-h-140 max-h-250 flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              connectionStatus === "connected"
                ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                : "bg-amber-500"
            }`}
          />
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight">
              {counterpartName}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {userRole === "PATIENT"
                ? appointment.doctor.designation || "Medical Specialist"
                : "Consultation with Patient"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {renderStatusBadge()}

          <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <AppointmentChatDialog
            appointmentId={appointment.id}
            counterpartName={counterpartName}
            role={userRole}
          />
        </div>
      </header>

      {/* Main Video Stage */}
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden">
        <section
          aria-label="Live consultation stage"
          className="relative flex min-h-90 items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-950 text-white shadow-inner"
        >
          {/* Remote Video Stream (Full Stage) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`h-full w-full object-cover transition-opacity duration-300 ${
              connectionStatus === "connected" && isRemoteVideoActive
                ? "opacity-100"
                : "hidden opacity-0"
            }`}
          />

          {/* Remote Participant Placeholder when not yet connected or camera off */}
          {(!isRemoteVideoActive || connectionStatus !== "connected") && (
            <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
              <div className="relative mb-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/40 bg-primary/10 text-primary shadow-lg sm:h-28 sm:w-28">
                  {userRole === "PATIENT" ? (
                    <Stethoscope className="h-12 w-12 sm:h-14 sm:w-14" />
                  ) : (
                    <User className="h-12 w-12 sm:h-14 sm:w-14" />
                  )}
                </div>
                {connectionStatus === "connecting" && (
                  <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-60" />
                )}
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-slate-100">
                {counterpartName}
              </h2>
              <p className="mt-1 max-w-sm text-xs text-slate-400">
                {connectionStatus === "connected"
                  ? "Audio connected (remote camera is muted)"
                  : connectionStatus === "connecting"
                    ? "Establishing secure WebRTC peer connection..."
                    : "Waiting for participant to join the consultation room..."}
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-sm">
                <Wifi className="h-3.5 w-3.5 text-primary" />
                <span>End-to-End Encrypted Telehealth Call</span>
              </div>
            </div>
          )}

          {/* Local Self-Video Picture-in-Picture */}
          <div
            className={`absolute bottom-4 right-4 z-20 overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900 shadow-2xl transition-all duration-200 ${
              isPipMinimized
                ? "h-10 w-28 cursor-pointer"
                : "h-32 w-44 sm:h-40 sm:w-56"
            }`}
          >
            {!isPipMinimized ? (
              <>
                {videoActive || isScreenSharing ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    aria-label="Your camera preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 bg-slate-900 p-2 text-center text-xs text-slate-400">
                    <VideoOff className="h-5 w-5 text-slate-500" />
                    <span className="text-[10px]">Camera is off</span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                  <span>{isScreenSharing ? "You (Screen)" : "You"}</span>
                  {!micActive && <MicOff className="h-3 w-3 text-rose-400" />}
                </div>

                <button
                  type="button"
                  onClick={() => setIsPipMinimized(true)}
                  className="absolute top-2 right-2 rounded bg-black/60 p-1 text-slate-300 hover:text-white backdrop-blur-xs"
                  title="Minimize self view"
                  aria-label="Minimize self view"
                >
                  <Minimize2 className="h-3 w-3" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsPipMinimized(false)}
                className="flex h-full w-full items-center justify-between px-2.5 text-xs text-slate-300 hover:text-white"
              >
                <span className="text-[10px] font-medium">You (Minimized)</span>
                <Maximize2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </section>

        {/* Doctor Clinical Notes Rail */}
        {userRole === "DOCTOR" && (
          <aside className="flex min-h-65 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xs lg:min-h-0">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
                <FileText className="h-4 w-4" />
                Clinical Consultation Notes
              </h2>
              <span className="text-[10px] text-muted-foreground">
                Auto-saved
              </span>
            </div>

            <textarea
              value={doctorNotes}
              onChange={(event) => setDoctorNotes(event.target.value)}
              placeholder="Record clinical impressions, medication dosages, observations, or follow-up instructions to attach to patient records..."
              aria-label="Clinical consultation notes"
              className="min-h-40 w-full flex-1 resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="default"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="flex-1 gap-1.5"
              >
                {isSavingNotes ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Save notes</span>
                  </>
                )}
              </Button>
            </div>
          </aside>
        )}
      </main>

      {/* Permission Alert Banner */}
      {hasPermissions === false && (
        <div
          role="alert"
          className="mx-3 mb-2 flex flex-col gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-3 sm:mx-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2.5 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                Camera or microphone unavailable
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {mediaError}
              </p>
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

      {/* Requesting Access Status */}
      {hasPermissions === null && (
        <div
          role="status"
          className="mx-3 mb-2 flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-xs text-muted-foreground sm:mx-4"
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Requesting camera and microphone access...
        </div>
      )}

      {/* Consultation Control Bar */}
      <footer className="flex items-center justify-between border-t border-border bg-card/95 px-4 py-3 sm:px-6">
        <div className="hidden text-xs text-muted-foreground sm:block">
          <span>Room ID: {appointment.id.slice(0, 8)}</span>
        </div>

        {/* Primary Media Buttons */}
        <div className="flex flex-1 items-center justify-center gap-3 sm:flex-initial">
          {/* Mic Toggle */}
          <Button
            size="icon"
            variant={micActive ? "secondary" : "outline"}
            className={`h-11 w-11 rounded-full ${
              !micActive
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : ""
            }`}
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

          {/* Video Toggle */}
          <Button
            size="icon"
            variant={videoActive ? "secondary" : "outline"}
            className={`h-11 w-11 rounded-full ${
              !videoActive
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : ""
            }`}
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

          {/* Screen Share */}
          <Button
            size="icon"
            variant={isScreenSharing ? "default" : "outline"}
            className="h-11 w-11 rounded-full"
            onClick={() => void toggleScreenShare()}
            aria-label={
              isScreenSharing ? "Stop sharing screen" : "Share screen"
            }
            title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
          >
            {isScreenSharing ? (
              <ScreenShareOff className="h-5 w-5" />
            ) : (
              <ScreenShare className="h-5 w-5" />
            )}
          </Button>

          {/* Fullscreen */}
          <Button
            size="icon"
            variant="outline"
            className="hidden h-11 w-11 rounded-full sm:inline-flex"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            <Expand className="h-5 w-5" />
          </Button>

          {/* End Call Button */}
          <Button
            size="icon"
            variant="destructive"
            className="h-11 w-11 rounded-full shadow-md"
            onClick={() => void handleEndCall()}
            disabled={isEndingCall}
            aria-label="End consultation"
            title="End consultation"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-muted-foreground">
            Encrypted Session
          </span>
        </div>
      </footer>
    </div>
  );
}
