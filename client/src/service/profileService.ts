import { client } from "@/utils/clients";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string;
}

export const getProfile = async (): Promise<{ user: UserProfile }> => {
  const { data } = await client.get("/profile");
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
  const { data } = await client.patch("/profile", payload);
  return data;
};
