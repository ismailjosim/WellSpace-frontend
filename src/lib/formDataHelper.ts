/**
 * Helper to normalize FormData received by React 19 Server Actions.
 *
 * In React 19 / Next.js 16+, forms submitted through useActionState often
 * prefix field names with `_1_<name>` or `_0_<name>` due to bound argument indexing.
 */

export const MAX_UPLOAD_FILE_SIZE_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_FILE_SIZE_LABEL = "4 MB";

export function isUploadFileTooLarge(file: File | Blob | null): boolean {
  return Boolean(file && file.size > MAX_UPLOAD_FILE_SIZE_BYTES);
}

export function normalizeFormData(formData: FormData): FormData {
  const normalized = new FormData();
  for (const [key, value] of formData.entries()) {
    const cleanKey = key.replace(/^_[0-9]+_/, "");
    const fileName =
      typeof value !== "string" && "name" in value ? value.name : undefined;

    if (fileName) {
      normalized.append(cleanKey, value as Blob, fileName);
      if (cleanKey !== key) {
        normalized.append(key, value as Blob, fileName);
      }
    } else {
      normalized.append(cleanKey, value);
      if (cleanKey !== key) {
        normalized.append(key, value);
      }
    }
  }
  return normalized;
}

export function getFormString(formData: FormData, key: string): string {
  const val =
    formData.get(key) ?? formData.get(`_1_${key}`) ?? formData.get(`_0_${key}`);
  return typeof val === "string" ? val : "";
}

export function getFormFile(
  formData: FormData,
  key: string,
): File | Blob | null {
  const val =
    formData.get(key) ?? formData.get(`_1_${key}`) ?? formData.get(`_0_${key}`);
  if (
    val &&
    typeof val === "object" &&
    "size" in val &&
    (val as Blob).size > 0
  ) {
    return val as Blob;
  }
  return null;
}

export function appendFormFile(
  targetFormData: FormData,
  fieldName: string,
  file: File | Blob | null,
  defaultName: string = "upload.jpg",
) {
  if (
    file &&
    typeof file === "object" &&
    "size" in file &&
    (file as Blob).size > 0
  ) {
    const fileName =
      "name" in file && typeof file.name === "string" && file.name
        ? file.name
        : defaultName;
    targetFormData.append(fieldName, file, fileName);
  }
}
