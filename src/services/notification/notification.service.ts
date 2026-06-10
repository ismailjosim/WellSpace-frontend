"use client";

import { INotificationResponse } from "@/types/notification.interface";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const getNotifications = async (): Promise<INotificationResponse> => {
  const response = await fetch(`${BACKEND_API_URL}/notifications?limit=10`, {
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Failed to load notifications");
  }

  return result.data;
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
