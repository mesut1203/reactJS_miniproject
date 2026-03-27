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
  const { data } = await client.put("/profile/me", payload);
  return data;
};

export interface ChangePasswordPayload {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const { data } = await client.patch("/profile/change-password", payload);
  return data;
};
