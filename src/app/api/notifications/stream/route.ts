/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://wellspace-backend-1.onrender.com/api/v1";

export async function GET() {
  const accessToken = await getCookie("accessToken");

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const backendStreamUrl = `${BACKEND_API_URL}/notifications/stream?token=${encodeURIComponent(
    accessToken
  )}`;

  try {
    const backendResponse = await fetch(backendStreamUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Cookie: `accessToken=${accessToken}`,
        Accept: "text/event-stream",
      },
      cache: "no-store",
    });

    if (!backendResponse.ok || !backendResponse.body) {
      return new Response("SSE stream not available", {
        status: backendResponse.status || 502,
      });
    }

    return new Response(backendResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return new Response(error?.message || "Stream error", { status: 500 });
  }
}
