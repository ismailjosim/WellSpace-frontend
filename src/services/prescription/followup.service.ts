"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface IFollowUpCareItem {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate: string;
  followUpStatus: "PENDING" | "BOOKED" | "COMPLETED" | "OVERDUE";
  followUpAppointmentId: string | null;
  createdAt: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto: string | null;
    designation: string;
    appointmentFee: number;
    doctorSpecialties?: {
      specialties: {
        id: string;
        title: string;
      };
    }[];
  };
  appointment?: {
    id: string;
    schedule?: {
      id: string;
      startDateTime: string;
      endDateTime: string;
    };
  };
}

export async function getMyFollowUps(): Promise<{
  success: boolean;
  message?: string;
  data: IFollowUpCareItem[];
}> {
  try {
    const res = await serverFetch.get("/prescription/my-followups", {
      cache: "no-store",
    });
    return await res.json();
  } catch (error: unknown) {
    console.error("Failed to fetch follow-ups:", error);
    return {
      success: false,
      message: "Failed to fetch follow-up care records",
      data: [],
    };
  }
}

export async function bookFollowUpAppointment(
  prescriptionId: string,
  scheduleId: string,
): Promise<{
  success: boolean;
  message: string;
  data?: unknown;
}> {
  try {
    const res = await serverFetch.post(
      `/prescription/${prescriptionId}/book-followup`,
      {
        body: JSON.stringify({ scheduleId }),
        headers: { "Content-Type": "application/json" },
      },
    );
    return await res.json();
  } catch (error: unknown) {
    console.error("Failed to book follow-up appointment:", error);
    return {
      success: false,
      message: "Network or server error while booking follow-up",
    };
  }
}
