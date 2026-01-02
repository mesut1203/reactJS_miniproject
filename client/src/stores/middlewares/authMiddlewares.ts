import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "@/utils/clients";

export const getAuthProfile = createAsyncThunk(
    "/profile/me",
    async (_, { rejectWithValue }) => {
        try {
            const { data: response } = await client.get("/profile/me");

            return response.user;
        } catch {
            return rejectWithValue("Unauthorized");
        }
    }
);
