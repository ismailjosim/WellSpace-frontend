/**
 * Helper to normalize FormData received by React 19 Server Actions.
 *
 * In React 19 / Next.js 16+, forms submitted through useActionState often
 * prefix field names with `_1_<name>` or `_0_<name>` due to bound argument indexing.
 */

export function normalizeFormData(formData: FormData): FormData {
  const normalized = new FormData();
  for (const [key, value] of formData.entries()) {
    const cleanKey = key.replace(/^_[0-9]+_/, "");
    normalized.append(cleanKey, value);
    if (cleanKey !== key) {
      normalized.append(key, value);
    }
  }
  return normalized;
}

export function getFormString(formData: FormData, key: string): string {
  const val =
    formData.get(key) ??
    formData.get(`_1_${key}`) ??
    formData.get(`_0_${key}`);
  return typeof val === "string" ? val : "";
}

export function getFormFile(
  formData: FormData,
  key: string,
): File | Blob | null {
  const val =
    formData.get(key) ??
    formData.get(`_1_${key}`) ??
    formData.get(`_0_${key}`);
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

