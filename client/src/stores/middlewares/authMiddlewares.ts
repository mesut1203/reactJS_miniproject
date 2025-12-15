import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "@/utils/clients";
import { getLocalToken } from "@/utils/auth";

export const getAuthProfile = createAsyncThunk(
    "/profile/me",
    async (_, { rejectWithValue }) => {
        try {
            const token = getLocalToken();
            if (!token) {
                throw new Error("Unauthorized");
            }

            const { data: response } = await client.get("/profile/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.user;
        } catch {
            return rejectWithValue("Unauthorized");
        }
    }
);
