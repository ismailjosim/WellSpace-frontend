/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "@/services/auth/tokenHandlers";
import { NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://wellspace-backend-1.onrender.com/api/v1";

export async function PATCH() {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to mark notifications read",
      },
      { status: 500 },
    );
  }
}
