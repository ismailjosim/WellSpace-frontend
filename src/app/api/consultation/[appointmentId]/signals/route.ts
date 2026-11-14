/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "@/services/auth/tokenHandlers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://wellspace-backend-1.onrender.com/api/v1";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ appointmentId: string }> },
) {
  try {
    const { appointmentId } = await context.params;
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const since = searchParams.get("since") || "0";

    const response = await fetch(
      `${BACKEND_API_URL}/consultation-session/${appointmentId}/signals?since=${since}`,
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
        message: error?.message || "Failed to retrieve signals",
      },
      { status: 500 },
    );
  }
}
