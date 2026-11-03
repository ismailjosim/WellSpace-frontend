"use server";
import z from "zod";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import {
  normalizeFormData,
  getFormFile,
  appendFormFile,
} from "@/lib/formDataHelper";

/* eslint-disable @typescript-eslint/no-explicit-any */
const createSpecialtyValidationSchema = z.object({
  title: z.string().min(3, "title must be at least 3 characters long"),
});

export async function createSpecialty(_prevState: any, rawFormData: FormData) {
  try {
    const formData = normalizeFormData(rawFormData);
    const payload = {
      title: formData.get("title") as string,
    };

    // ✅ Store the validation result once
    const validation = zodValidator(payload, createSpecialtyValidationSchema);

    // ✅ Early return if validation fails
    if (!validation.success) {
      return validation;
    }

    // ✅ TypeScript now knows validation.data exists
    const validatedPayload = validation.data;

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(validatedPayload));

    const file = getFormFile(formData, "file");
    appendFormFile(newFormData, "file", file, "specialty.png");

    const res = await serverFetch.post("/specialties", {
      body: newFormData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create Specialty. Please try again.",
    };
  }
}

export async function updateSpecialty(
  id: string,
  _prevState: any,
  rawFormData: FormData,
) {
  try {
    const formData = normalizeFormData(rawFormData);
    const title = formData.get("title") as string;
    const newFormData = new FormData();

    if (title) {
      newFormData.append("data", JSON.stringify({ title }));
    }

    const file = formData.get("file");
    if (file && (file as Blob).size > 0) {
      newFormData.append("file", file as Blob);
    }

    const res = await serverFetch.patch(`/specialties/${id}`, {
      body: newFormData,
    });
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to update Specialty. Please try again.",
    };
  }
}

export async function getSpecialties(queryString?: string) {
  try {
    const res = await serverFetch.get(
      `/specialties${queryString ? `?${queryString}` : ""}`,
    );
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong!",
    };
  }
}

export async function deleteSpecialty(id: string) {
  try {
    const res = await serverFetch.delete(`/specialties/${id}`);
    const result = await res.json();
    return result;
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Something went wrong!",
    };
  }
}
