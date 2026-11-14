"use server";

import { redirect } from "next/navigation";
import { deleteCookie, getCookie } from "./tokenHandlers";
import { serverFetch } from "@/lib/server-fetch";

export const logoutUser = async () => {
  try {
    const refreshToken = await getCookie("refreshToken");
    await serverFetch.post("/auth/logout", {
      body: JSON.stringify({ refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch {
    // Graceful continuation even if backend is offline
  }

  await deleteCookie("accessToken");
  await deleteCookie("refreshToken");
  redirect("/login?loggedOut=true");
};
