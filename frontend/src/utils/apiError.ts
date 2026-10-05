import { isAxiosError } from "axios";

export function apiErrorMessage(error: unknown): string {
  if (isAxiosError(error) && typeof error.response?.data?.detail === "string") {
    return error.response.data.detail;
  }
  return error instanceof Error ? error.message : "The request failed. Please try again.";
}
