"use server";

import { serverFetch } from "@/lib/server-fetch";
import { setCookie } from "./tokenHandlers";
import { parse } from "cookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  getDefaultDashboardRoutes,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";

const isProduction = process.env.NODE_ENV === "production";

export interface IMfaSetupResponse {
  success: boolean;
  message?: string;
  data?: {
    qrCode: string;
    secretKey: string;
    backupCodes: string[];
  };
}

export async function initiateMfaSetup(): Promise<IMfaSetupResponse> {
  try {
    const res = await serverFetch.post("/auth/mfa/setup", {
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error: unknown) {
    console.error("MFA setup error:", error);
    return { success: false, message: "Failed to initiate MFA setup" };
  }
}

export async function verifyMfaSetup(
  token: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.post("/auth/mfa/verify-setup", {
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error: unknown) {
    console.error("MFA verify setup error:", error);
    return { success: false, message: "Failed to verify MFA setup" };
  }
}

export async function disableMfa(
  token: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await serverFetch.post("/auth/mfa/disable", {
      body: JSON.stringify({ token }),
      headers: { "Content-Type": "application/json" },
    });
    return await res.json();
  } catch (error: unknown) {
    console.error("MFA disable error:", error);
    return { success: false, message: "Failed to disable MFA" };
  }
}

export async function submitMfaChallenge(
  mfaToken: string,
  code: string,
  isBackupCode: boolean = false,
  redirectUrl: string | null = null,
): Promise<{
  success: boolean;
  message: string;
  redirectTo?: string;
}> {
  try {
    const res = await serverFetch.post("/auth/mfa/challenge", {
      body: JSON.stringify({ mfaToken, code, isBackupCode }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!result.success) {
      return {
        success: false,
        message: result.message || "Invalid two-factor code",
      };
    }

    let accessTokenObj: Record<string, string> | null = null;
    let refreshTokenObj: Record<string, string> | null = null;

    const setCookieHeaders = res.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsed = parse(cookie);
        if (parsed["accessToken"])
          accessTokenObj = parsed as Record<string, string>;
        if (parsed["refreshToken"])
          refreshTokenObj = parsed as Record<string, string>;
      });
    }

    const accessTokenVal: string | undefined =
      accessTokenObj?.["accessToken"] ||
      (result.data as { accessToken?: string })?.accessToken;
    const refreshTokenVal: string | undefined =
      accessTokenObj?.["refreshToken"] ||
      (result.data as { refreshToken?: string })?.refreshToken;

    if (!accessTokenVal || !refreshTokenVal) {
      return { success: false, message: "Authentication session missing" };
    }

    await setCookie("accessToken", accessTokenVal, {
      secure: isProduction,
      httpOnly: true,
      maxAge: accessTokenObj
        ? parseInt(accessTokenObj["Max-Age"]) || undefined
        : 86400,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
    });

    await setCookie("refreshToken", refreshTokenVal, {
      secure: isProduction,
      httpOnly: true,
      maxAge: refreshTokenObj
        ? parseInt(refreshTokenObj["Max-Age"]) || undefined
        : 604800,
      path: "/",
      sameSite: isProduction ? "none" : "lax",
    });

    let userRole: UserRole = "PATIENT";
    try {
      const verifiedToken = jwt.decode(accessTokenVal) as JwtPayload;
      if (verifiedToken && verifiedToken.role) {
        userRole = verifiedToken.role as UserRole;
      }
    } catch {
      // Fallback to role in response data
      if (result.data?.user?.role) {
        userRole = result.data.user.role as UserRole;
      }
    }

    const defaultRoute = getDefaultDashboardRoutes(userRole);
    let finalRedirect = defaultRoute;
    if (redirectUrl && isValidRedirectForRole(redirectUrl, userRole)) {
      finalRedirect = redirectUrl;
    }

    return {
      success: true,
      message: "Two-factor authentication successful",
      redirectTo: finalRedirect,
    };
  } catch (error: unknown) {
    console.error("MFA challenge error:", error);
    return {
      success: false,
      message: "Network or server error during MFA challenge",
    };
  }
}
