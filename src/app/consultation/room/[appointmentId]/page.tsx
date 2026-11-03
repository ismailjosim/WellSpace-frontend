import { getConsultationSession } from "@/services/consultation/consultation.service";
import LiveConsultationRoom from "@/components/modules/Consultation/LiveConsultationRoom";
import { getCookie } from "@/services/auth/tokenHandlers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";

interface ConsultationRoomPageProps {
  params: Promise<{
    appointmentId: string;
  }>;
}

export const dynamic = "force-dynamic";

interface DecodedToken {
  role?: string;
  userId?: string;
  email?: string;
}

export default async function ConsultationRoomPage({
  params,
}: ConsultationRoomPageProps) {
  const { appointmentId } = await params;
  const accessToken = await getCookie("accessToken");

  if (!accessToken) {
    redirect(`/login?redirect=/consultation/room/${appointmentId}`);
  }

  let userRole: "PATIENT" | "DOCTOR" = "PATIENT";
  try {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    if (decoded?.role === "DOCTOR") {
      userRole = "DOCTOR";
    }
  } catch {
    // default to PATIENT
  }

  const res = await getConsultationSession(appointmentId);

  if (!res.success || !res.data) {
    return (
      <div className="container max-w-lg mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">
          Unable to Join Consultation Room
        </h2>
        <p className="text-sm text-muted-foreground">
          {res.message ||
            "You may not be authorized to join this consultation, or the appointment has been canceled."}
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4">
      <LiveConsultationRoom initialData={res.data} userRole={userRole} />
    </div>
  );
}
