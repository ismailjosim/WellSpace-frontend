"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface ISettingItem {
  id: string;
  key: string;
  value: string;
  category: "APPOINTMENT" | "PAYMENT" | "GENERAL" | "SECURITY";
  description: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

export interface IAllSettingsResponse {
  success: boolean;
  message: string;
  data: {
    raw: ISettingItem[];
    byCategory: Record<string, ISettingItem[]>;
  };
}

export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const BACKEND_API_URL = process.env.BACKEND_API_URL;
    const res = await fetch(`${BACKEND_API_URL}/settings/public`, {
      next: { revalidate: 60 },
    });
    const json = await res.json();
    return json.data || {};
  } catch (error: unknown) {
    console.error("Failed to fetch public settings:", error);
    return {};
  }
}

export async function getAllAdminSettings(): Promise<IAllSettingsResponse> {
  try {
    const res = await serverFetch.get("/settings/admin", { cache: "no-store" });
    const json = await res.json();
    return json;
  } catch (error: unknown) {
    console.error("Failed to fetch admin settings:", error);
    return {
      success: false,
      message: "Failed to fetch settings",
      data: { raw: [], byCategory: {} },
    };
  }
}

export async function updateAdminSettings(
  settings: Record<string, string>,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.patch("/settings/admin", {
      body: JSON.stringify(settings),
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    return json;
  } catch (error: unknown) {
    console.error("Failed to update settings:", error);
    return {
      success: false,
      message: "Network or server error updating settings",
    };
  }
}
