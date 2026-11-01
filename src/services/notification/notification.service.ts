"use client";

import { INotificationResponse } from "@/types/notification.interface";

const getNotifications = async (): Promise<INotificationResponse> => {
  try {
    const response = await fetch(`/api/notifications?limit=10`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load notifications");
    }

    return result.data;
  } catch (error: unknown) {
    console.error("[Notifications Fetch Error]", error);
    throw error;
  }
};

const markNotificationAsRead = async (id: string) => {
  const response = await fetch(`/api/notifications/${id}/read`, {
    method: "PATCH",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to mark notification as read");
  }

  return result.data;
};

const markAllNotificationsAsRead = async () => {
  const response = await fetch(`/api/notifications/read-all`, {
    method: "PATCH",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to mark notifications as read");
  }

  return result.data;
};

const getNotificationStreamUrl = () => `/api/notifications/stream`;

export const notificationService = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationStreamUrl,
};
