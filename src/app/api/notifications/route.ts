/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "@/services/auth/tokenHandlers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://wellspace-backend-1.onrender.com/api/v1";

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";

    const response = await fetch(
      `${BACKEND_API_URL}/notifications?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Cookie: `accessToken=${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch notifications",
      },
      { status: 500 },
    );
  }
}
