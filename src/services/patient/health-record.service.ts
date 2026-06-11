"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function getMyHealthRecord() {
  try {
    const response = await serverFetch.get("/patient/me/health-record");
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching health record:", error);
    return {
      success: false,
      data: null,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch health record",
    };
  }
}

export async function updateMyHealthData(data: Record<string, unknown>) {
  try {
    const response = await serverFetch.patch("/patient/me/health-data", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error: any) {
    console.error("Error updating health data:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update health data",
    };
  }
}

export async function uploadMedicalReport(formData: FormData) {
  try {
    const response = await serverFetch.post("/patient/me/medical-reports", {
      body: formData,
    });

    return await response.json();
  } catch (error: any) {
    console.error("Error uploading medical report:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to upload medical report",
    };
  }
}

export async function deleteMedicalReport(reportId: string) {
  try {
    const response = await serverFetch.delete(
      `/patient/me/medical-reports/${reportId}`,
    );

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting medical report:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to delete medical report",
    };
  }
}
