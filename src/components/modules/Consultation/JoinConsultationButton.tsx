"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface JoinConsultationButtonProps {
  appointmentId: string;
  label: string;
}

export default function JoinConsultationButton({
  appointmentId,
  label,
}: JoinConsultationButtonProps) {
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleJoin = async () => {
    setIsRequesting(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone access requires a supported browser and a secure connection (HTTPS).",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Camera or microphone permission was denied. You can allow access and retry in the consultation room."
          : error instanceof Error
            ? error.message
            : "Unable to request camera and microphone access.";
      toast.error(message);
    } finally {
      router.push(`/consultation/room/${appointmentId}`);
    }
  };

  return (
    <Button
      size="sm"
      className="gap-1.5"
      onClick={handleJoin}
      disabled={isRequesting}
    >
      {isRequesting ? "Requesting access..." : label}
    </Button>
  );
}
