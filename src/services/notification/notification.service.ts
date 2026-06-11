"use client";

import { INotificationResponse } from "@/types/notification.interface";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const getNotifications = async (): Promise<INotificationResponse> => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/notifications?limit=10`, {
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
        result.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    if (!result.success) {
      throw new Error(result.message || "Failed to load notifications");
    }

    return result.data;
  } catch (error: any) {
    console.error("[Notifications Fetch Error]", error);
    throw error;
  }
};

const markNotificationAsRead = async (id: string) => {
  const response = await fetch(`${BACKEND_API_URL}/notifications/${id}/read`, {
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
  const response = await fetch(`${BACKEND_API_URL}/notifications/read-all`, {
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
  `${BACKEND_API_URL}/notifications/stream`;

export const notificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStreamUrl,
};
