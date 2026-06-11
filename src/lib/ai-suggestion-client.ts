export type AISuggestionDoctor = {
  id?: string;
  name?: string;
  designation?: string;
  qualification?: string;
  averageRating?: number;
  appointmentFee?: number;
};

export type AISuggestionResult = {
  totalDoctors?: number;
  recommendedDoctors?: AISuggestionDoctor[];
  reasoning?: string;
};

export async function fetchAIDoctorSuggestion(symptoms: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not configured");
  }

  const response = await fetch(`${backendUrl}/doctor/suggestion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms: symptoms.trim() }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to get AI recommendation");
  }

  return result.data as AISuggestionResult;
}
