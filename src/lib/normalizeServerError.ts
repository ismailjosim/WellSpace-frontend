/* eslint-disable @typescript-eslint/no-explicit-any */

import { responseTemplate } from "./responseTemplate";

/**
 * Transforms technical backend error messages into clear, human-friendly guidance.
 */
export const sanitizeErrorMessage = (rawMessage?: string): string => {
  if (!rawMessage || typeof rawMessage !== "string") {
    return "Something went wrong. Please try again.";
  }

  const lower = rawMessage.toLowerCase();

  // Technical database errors
  if (
    lower.includes("database request error") ||
    lower.includes("driveradaptererror") ||
    lower.includes("databasenotreachable") ||
    lower.includes("can't reach database") ||
    lower.includes("prisma")
  ) {
    return "Our service is temporarily experiencing high traffic or maintenance. Please try again in a moment.";
  }

  // Network / server connection failures
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("econnrefused") ||
    lower.includes("etimedout")
  ) {
    return "Unable to connect to the healthcare network. Please check your internet connection.";
  }

  // Duplicate records
  if (lower.includes("duplicate key") || lower.includes("already exists")) {
    return "An account or entry with these details already exists.";
  }

  // Record not found
  if (lower.includes("not found") || lower.includes("p2025")) {
    return "The requested record was not found or is no longer available.";
  }

  return rawMessage;
};

export const normalizeServerError = (result: any) => {
  const userFriendlyMessage = sanitizeErrorMessage(result?.message);

  const template = responseTemplate({
    type: "server",
    message: userFriendlyMessage,
  });

  // 👉 Zod validation errors (array)
  if (Array.isArray(result?.error)) {
    template.type = "validation";
    template.errors = result.error.map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    return template;
  }

  // 👉 Prisma / AppError / General errors
  if (typeof result?.error === "object" && result?.error !== null) {
    template.code = result.error.code || result.error.cause || null;
    return template;
  }

  return template;
};
