"use server";
import {
  getDefaultDashboardRoutes,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/auth-utils";

import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";

import { parse } from "cookie";
import jwt from "jsonwebtoken";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getUserInfo } from "./getUserInfo";
import { deleteCookie, getCookie, setCookie } from "./tokenHandlers";
import {
  changePasswordZodSchema,
  forgotPasswordZodSchema,
  resetPasswordSchema,
} from "../../schema/authSchema";
import { verifyAccessToken } from "../../lib/JWTHandlers";
import {
  normalizeFormData,
  getFormFile,
  appendFormFile,
  isUploadFileTooLarge,
  MAX_UPLOAD_FILE_SIZE_LABEL,
} from "@/lib/formDataHelper";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function updateMyProfile(rawFormData: FormData) {
  try {
    const formData = normalizeFormData(rawFormData);
    // Create a new FormData with the data property
    const uploadFormData = new FormData();

    // Get all form fields except the file
    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "file" && key !== "profilePhoto" && value) {
        data[key] = value;
      }
    });

    // Add the data as JSON string
    uploadFormData.append("data", JSON.stringify(data));

    // Add the file if it exists
    const file = getFormFile(formData, "file");
    if (isUploadFileTooLarge(file)) {
      return {
        success: false,
        message: `Profile photo must be ${MAX_UPLOAD_FILE_SIZE_LABEL} or smaller.`,
      };
    }
    appendFormFile(uploadFormData, "file", file, "profile.jpg");

    const response = await serverFetch.patch(`/user/update-my-profile`, {
      body: uploadFormData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result?.message || "Failed to update profile",
      };
    }

    try {
      (revalidateTag as any)("user-info", { expire: 0 });
    } catch {
      // ignore
    }

    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: `${
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong"
      }`,
    };
  }
}

// Reset Password
export async function resetPassword(_prevState: any, rawFormData: FormData) {
  const formData = normalizeFormData(rawFormData);
  const redirectTo = formData.get("redirect") || null;

  // Build validation payload
  const validationPayload = {
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate
  const validatedPayload = zodValidator(validationPayload, resetPasswordSchema);

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }
  const payload = validatedPayload.success ? validatedPayload.data : null;
  // console.log(payload)

  try {
    const accessToken = await getCookie("accessToken");

    if (!accessToken) {
      throw new Error("User not authenticated");
    }

    const verifiedToken = jwt.verify(
      accessToken as string,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as jwt.JwtPayload;

    const userRole: UserRole = verifiedToken.role;

    const user = await getUserInfo();
    revalidateTag("user-info", { expire: 0 });
    // console.log(user)
    // API Call
    const response = await serverFetch.post("/auth/reset-password", {
      body: JSON.stringify({
        id: user?.id,
        password: payload?.newPassword,
      }),
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Reset password failed");
    }

    if (result.success) {
      // await get
      revalidateTag("user-info", { expire: 0 });
    }

    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(`${requestedPath}?loggedIn=true`);
      } else {
        redirect(`${getDefaultDashboardRoutes(userRole)}?loggedIn=true`);
      }
    } else {
      redirect(`${getDefaultDashboardRoutes(userRole)}?loggedIn=true`);
    }
  } catch (error: any) {
    console.log("error in reset password", error);
    // Re-throw NEXT_REDIRECT errors so Next.js can handle them
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: error?.message || "Something went wrong",
      formData: validationPayload,
    };
  }
}

export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie("accessToken");
    const refreshToken = await getCookie("refreshToken");

    //Case 1: Both tokens are missing - user is logged out
    if (!accessToken && !refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    // Case 2 : Access Token exist- and need to verify
    if (accessToken) {
      const verifiedToken = await verifyAccessToken(accessToken);

      if (verifiedToken.success) {
        return {
          tokenRefreshed: false,
        };
      }
    }

    //Case 3 : refresh Token is missing- user is logged out
    if (!refreshToken) {
      return {
        tokenRefreshed: false,
      };
    }

    //Case 4: Access Token is invalid/expired- try to get a new one using refresh token
    // This is the only case we need to call the API

    // Now we know: accessToken is invalid/missing AND refreshToken exists
    // Safe to call the API
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;

    // API Call - serverFetch will skip getNewAccessToken for /auth/refresh-token endpoint
    const response = await serverFetch.post("/auth/refresh-token", {
      // Send in body, not Cookie header
      body: JSON.stringify({ refreshToken }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // console.log('access token refreshed!!')

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);

        if (parsedCookie["accessToken"]) {
          accessTokenObject = parsedCookie;
        }
        if (parsedCookie["refreshToken"]) {
          refreshTokenObject = parsedCookie;
        }
      });
    } else {
      throw new Error("No Set-Cookie header found");
    }

    if (!accessTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    if (!refreshTokenObject) {
      throw new Error("Tokens not found in cookies");
    }

    await deleteCookie("accessToken");
    await setCookie("accessToken", accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject["Max-Age"]) || 1000 * 60 * 60,
      path: accessTokenObject.Path || "/",
      sameSite: accessTokenObject["SameSite"] || "none",
    });

    await deleteCookie("refreshToken");
    await setCookie("refreshToken", refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge:
        parseInt(refreshTokenObject["Max-Age"]) || 1000 * 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || "/",
      sameSite: refreshTokenObject["SameSite"] || "none",
    });

    if (!result.success) {
      throw new Error(result.message || "Token refresh failed");
    }

    return {
      tokenRefreshed: true,
      success: true,
      message: "Token refreshed successfully",
    };
  } catch (error: any) {
    return {
      tokenRefreshed: false,
      success: false,
      message: error?.message || "Something went wrong",
    };
  }
}

export async function forgotPassword(_prevState: any, rawFormData: FormData) {
  const formData = normalizeFormData(rawFormData);
  // Build validation payload
  const validationPayload = {
    email: formData.get("email") as string,
  };

  // Validate
  const validatedPayload = zodValidator(
    validationPayload,
    forgotPasswordZodSchema,
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  try {
    // API Call
    const response = await serverFetch.post("/auth/forgot-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: validationPayload.email,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Failed to send reset link");
    }

    return {
      success: true,
      message: "Password reset link has been sent to your email!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
      formData: validationPayload,
    };
  }
}

export async function changePassword(_prevState: any, rawFormData: FormData) {
  const formData = normalizeFormData(rawFormData);
  // Build validation payload
  const validationPayload = {
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Validate
  const validatedPayload = zodValidator(
    validationPayload,
    changePasswordZodSchema,
  );

  if (!validatedPayload.success && validatedPayload.errors) {
    return {
      success: false,
      message: "Validation failed",
      formData: validationPayload,
      errors: validatedPayload.errors,
    };
  }

  try {
    // API Call
    const response = await serverFetch.post("/auth/change-password", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: validationPayload.oldPassword,
        newPassword: validationPayload.newPassword,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Password change failed");
    }

    return {
      success: true,
      message: result.message || "Password changed successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Something went wrong",
      formData: validationPayload,
    };
  }
}
