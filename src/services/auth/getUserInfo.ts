/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { UserInfo } from "@/types/user.interface";
import { getCookie } from "./tokenHandlers";

import jwt, { JwtPayload } from "jsonwebtoken";
import { serverFetch } from "../../lib/server-fetch";

export const getUserInfo = async (): Promise<UserInfo | any> => {
  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      return {
        id: "",
        name: "Unknown User",
        email: "",
        role: "PATIENT",
      };
    }

    let tokenPayload: JwtPayload | null = null;
    try {
      tokenPayload = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as JwtPayload;
    } catch {
      // Token expired or invalid
    }

    const response = await serverFetch.get("/auth/me", {
      cache: "force-cache",
      next: { tags: ["user-info"] },
    });

    const result = await response.json();

    if (result.success && result.data) {
      const role = tokenPayload?.role || result.data.role;
      const profile = result.data.profile;

      return {
        ...result.data,
        name:
          result.data.admin?.name ||
          result.data.doctor?.name ||
          result.data.patient?.name ||
          profile?.name ||
          result.data.name ||
          tokenPayload?.name ||
          "Unknown User",
        role,
        admin:
          result.data.admin ||
          (role === "ADMIN" || role === "SUPER_ADMIN" ? profile : undefined),
        doctor: result.data.doctor || (role === "DOCTOR" ? profile : undefined),
        patient:
          result.data.patient || (role === "PATIENT" ? profile : undefined),
      };
    }

    // Fallback using decoded token payload if /auth/me returns error
    if (tokenPayload) {
      return {
        id: tokenPayload.userId || tokenPayload.id || "",
        name: tokenPayload.name || "Unknown User",
        email: tokenPayload.email || "",
        role: tokenPayload.role || "PATIENT",
        needPasswordChange: tokenPayload.needPasswordChange || false,
      };
    }

    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "PATIENT",
    };
  } catch {
    // Ultimate fallback if fetch threw
    const accessToken = await getCookie("accessToken");
    if (accessToken) {
      try {
        const verifiedToken = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string,
        ) as JwtPayload;

        return {
          id: verifiedToken.userId || verifiedToken.id || "",
          name: verifiedToken.name || "Unknown User",
          email: verifiedToken.email || "",
          role: verifiedToken.role || "PATIENT",
          needPasswordChange: verifiedToken.needPasswordChange || false,
        };
      } catch {
        // ignore
      }
    }

    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "PATIENT",
    };
  }
};
