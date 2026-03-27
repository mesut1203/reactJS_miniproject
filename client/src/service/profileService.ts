import { client } from "@/utils/clients";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
}

export const getProfile = async (): Promise<{ user: UserProfile }> => {
  const { data } = await client.get("/profile/me");
  return data;
};

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  birthDate?: string;
}

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<{ user: UserProfile }> => {
  const { data } = await client.patch("/profile/me", payload);
  return data;
};
