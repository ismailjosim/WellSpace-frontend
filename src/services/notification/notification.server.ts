/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";

export async function getSingleNotification(id: string) {
  try {
    const res = await serverFetch.get(`/notifications/${id}`, {
      cache: "no-store",
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("[getSingleNotification error]", error);
    return {
      success: false,
      message: error?.message || "Failed to load notification details",
      data: null,
    };
  }
}

export async function getAllNotifications(queryString?: string) {
  try {
    const res = await serverFetch.get(
      `/notifications${queryString ? `?${queryString}` : ""}`,
      { cache: "no-store" },
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.error("[getAllNotifications error]", error);
    return {
      success: false,
      message: error?.message || "Failed to load notifications",
      data: { notifications: [], unreadCount: 0 },
    };
  }
}
