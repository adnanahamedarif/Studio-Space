import { authClient } from "@/lib/auth-client";

export const getTokenFromClient = async (): Promise<string | null> => {
  try {
    const { data, error } = await authClient.token();
    if (error) {
      console.error("JWT token error:", error);
      return null;
    }
    return data?.token || null;
  } catch (error) {
    console.error("Failed to get JWT token:", error);
    return null;
  }
};
