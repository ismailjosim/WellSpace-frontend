"use server";

import { serverFetch } from "@/lib/server-fetch";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export async function getConsultationSession(appointmentId: string) {
  try {
    const res = await serverFetch.get(`/consultation-session/${appointmentId}`);
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to enter consultation room"),
    };
  }
}

export async function endConsultationSession(
  appointmentId: string,
  notes?: string,
) {
  try {
    const res = await serverFetch.post(
      `/consultation-session/${appointmentId}/end`,
      {
        body: JSON.stringify({ notes }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to end consultation"),
    };
  }
}

export async function saveConsultationNotes(
  appointmentId: string,
  notes: string,
) {
  try {
    const res = await serverFetch.patch(
      `/consultation-session/${appointmentId}/notes`,
      {
        body: JSON.stringify({ notes }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to save notes"),
    };
  }
}
