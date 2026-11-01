"use server";

import { serverFetch } from "@/lib/server-fetch";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export async function getChatRoom(appointmentId: string) {
  try {
    const res = await serverFetch.get(`/chat/${appointmentId}`);
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to load chat"),
    };
  }
}

export async function sendChatMessage(
  appointmentId: string,
  data: { content: string; attachment?: string; fileType?: string },
) {
  try {
    const res = await serverFetch.post(`/chat/${appointmentId}/messages`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: getErrorMessage(error, "Failed to send message"),
    };
  }
}

export async function markChatAsRead(appointmentId: string) {
  try {
    const res = await serverFetch.patch(`/chat/${appointmentId}/read`);
    return await res.json();
  } catch (error: unknown) {
    return {
      success: false,
      message: getErrorMessage(error, "Failed to mark as read"),
    };
  }
}
