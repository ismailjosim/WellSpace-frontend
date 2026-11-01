"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface IAuditLog {
  id: string;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface IAuditLogsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IAuditLog[];
}

export async function getAuditLogs(
  queryParams: Record<string, string | number | undefined> = {},
): Promise<IAuditLogsResponse> {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/admin/audit-logs${queryString ? `?${queryString}` : ""}`;
    const res = await serverFetch.get(endpoint, { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (error: unknown) {
    console.error("Failed to fetch audit logs:", error);
    return {
      success: false,
      message: "Failed to fetch audit logs",
      meta: { page: 1, limit: 10, total: 0 },
      data: [],
    };
  }
}

export async function exportAuditLogsCsv(
  queryParams: Record<string, string | number | undefined> = {},
): Promise<string> {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/admin/audit-logs/export-csv${queryString ? `?${queryString}` : ""}`;
    const res = await serverFetch.get(endpoint);
    return await res.text();
  } catch (error: unknown) {
    console.error("Failed to export audit logs CSV:", error);
    return "";
  }
}
