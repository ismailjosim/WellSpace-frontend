"use client";

import { INotificationResponse } from "@/types/notification.interface";

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    process.env.BACKEND_API_URL ||
    "https://wellspace-backend-1.onrender.com/api/v1"
  );
};

const getNotifications = async (): Promise<INotificationResponse> => {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/notifications?limit=10`, {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log response status for debugging
    console.log("[Notifications API]", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Notifications Error]", result);
      throw new Error(
        result.message ||
          `API Error: ${response.status} ${response.statusText}`,
      );
    }

    if (!result.success) {
      throw new Error(result.message || "Failed to load notifications");
    }

    return result.data;
  } catch (error: unknown) {
    console.error("[Notifications Fetch Error]", error);
    throw error;
  }
};

const markNotificationAsRead = async (id: string) => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/notifications/${id}/read`, {
    method: "PATCH",
    credentials: "include",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to mark notification as read");
  }

  return result.data;
};

const markAllNotificationsAsRead = async () => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/notifications/read-all`, {
    method: "PATCH",
    credentials: "include",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to mark notifications as read");
  }

  return result.data;
};

const getNotificationStreamUrl = () =>
  `${getApiBaseUrl()}/notifications/stream`;

export const notificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStreamUrl,
};
